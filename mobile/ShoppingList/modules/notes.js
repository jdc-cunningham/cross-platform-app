import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import { getPercent } from '../utils/math';

/**
 * PlainJS AJAX until I can install Axios
 */
const postAjax = (url, data, success) => {
    console.log('post ajax fcn');
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
        else if (xhr.status !== 200) { console.log('req failed', xhr.responseText); } // I only use 200/400/401/403 at this time
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
    return xhr;
}

/**
 * This module is primarily based on keyUp/press/change events
 * the buttons primarily are part of displaying/informing user of functionality
 * but they also can flex to be actual buttons that are clickable.
 */
const Notes = () => {
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [searchStr, setSearchStr] = useState("");
    const [titleBtnMode, setTitleBtnMode] = useState("");
    const [activeNote, setActiveNote] = useState(null);
    const [noteSearchResults, setNoteSearchResults] = useState([]);
    const apiSearchPath = "http://192.168.1.188:5000/search-notes";
    const searchInput = useRef(null);

    /**
     * There are three modes:
     * default: search display (doesn't do anything)
     * create: button (makes new note)
     * delete: button (deletes note)
     */
    const getBtn = (() => {
        switch(titleBtnMode) {
            case "create":
                return <Text style={ styles.noteBtnText }>create</Text>;
            case "delete":
                return <Text style={ styles.noteBtnText }>delete</Text>;
            case "processing":
                return <Image style={ styles.noteBtnLoadingSpinner } source={require('../assets/gifs/ajax-loader--blue.gif')} />
            default:
                return null;
        }
    })();

    const updateNoteBtn = ( event ) => {
        setTitleBtnMode("");
        setNoteSearchResults([]);
        clearTimeout(searchTimeout);
        const { text } = event.nativeEvent; // incoming text

        if (processing) {
            setSearchStr(searchStr); // don't change value
        } else {
            setSearchStr(text);
        }
            
        setSearchTimeout(
            setTimeout(() => {
                if (text.length) {
                    setProcessing(true);
                    setTitleBtnMode("processing"); // this is kind of ugly
                    getNote(text);
                } else {
                    setTitleBtnMode("search");
                    setProcessing(false);
                }
            }, 500));
    }


    const getNote = ( noteTitle ) => {
        postAjax(
            apiSearchPath,
            { "noteQueryStr": noteTitle },
            (data) => {
                setProcessing(false);
                const searchResults = JSON.parse(data);
                if (searchResults.notes.length) {
                    setNoteSearchResults(searchResults.notes);
                    setTitleBtnMode("");
                } else {
                    setTitleBtnMode("create");
                }
            }
        )
    }

    const noteBody = (() => {
        switch(!!activeNote) { // forced boolean
            case activeNote:
                return <TextInput>{ activeNote.body }</TextInput>
            default: // show recent notes maybe
                return <Text></Text>;
        }
    })();

    const getNoteBody = ( noteId ) => {
        console.log('get note body', noteId);
    }
    
    return (
        <View style={ styles.notesModule }>
            <View style={ styles.noteTitle }>
                <TextInput
                    ref={ searchInput }
                    style={ styles.noteTitleInput }
                    placeholder="search note"
                    onChange={ updateNoteBtn }
                    value={ searchStr }
                    editable={ processing ? false : true }/>
                <View style={ styles.noteBtn }>
                    { getBtn }
                </View>
                <View style={ !noteSearchResults.length ? styles.displayNone : styles.searchResultsContainer }>
                    <FlatList
                        data={ noteSearchResults }
                        keyExtractor={ item => item.id.toString() }
                        renderItem={ ({ item }) => (
                            <TouchableOpacity style={ styles.noteSearchResult } onPress={ () => getNoteBody(item.id) }>
                                <View selectNote={ item.id }>
                                    <Text style={ styles.noteSearchResultText }>{ item.name }</Text>
                                </View>
                            </TouchableOpacity>
                        )}/>
                </View>
            </View>
            { noteBody }
        </View>
    )
}

const styles = StyleSheet.create({
    displayNone: {
        display: "none"
    },
    notesModule: {

    },
    noteTitle: {
        position: "relative",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "flex-start",
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        height: getPercent(10)
    },
    noteTitleInput: { 
        flex: 1,
        paddingLeft: getPercent(3),
        paddingRight: getPercent(3)
    },
    noteBtn: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2a9df4"
    },
    noteBtnText: {
        fontSize: 18,
        color: "white",
        paddingLeft: getPercent(3),
        paddingRight: getPercent(3)
    },
    noteBtnLoadingSpinner: {
        marginLeft: getPercent(3),
        marginRight: getPercent(3)
    },
    searchResultsContainer: {
        position: "absolute",
        top: getPercent(10),
        left: 0,
        width: getPercent(100)
    },
    noteSearchResult: {
        flex: 1,
        paddingLeft: getPercent(3),
        paddingRight: getPercent(3),
        paddingTop: 5,
        paddingBottom: 5,
        width: getPercent(100)
    },
    noteSearchResultText: {
        fontSize: 18
    }
});

export default Notes;