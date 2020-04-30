import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, TextInput, Image, FlatList, TouchableOpacity } from 'react-native';
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
    const [activeNote, setActiveNote] = useState({});
    const [noteSearchResults, setNoteSearchResults] = useState([]);
    const apiNoteSearchPath = "http://192.168.1.188:5000/search-notes";
    const apiGetNoteBodyPath = "http://192.168.1.188:5000/get-note-body";
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
                return <Image style={ styles.noteBtnLoadingSpinner } source={require('../assets/gifs/ajax-loader--gray.gif')} />
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
            apiNoteSearchPath,
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

    // this could have alternate functionality on display like most recent notes
    const noteBody = (() => {
        if (Object.keys(activeNote).length) {
            return <TextInput style={ styles.noteBodyText } multiline>{ activeNote.body }</TextInput>
        } else {
            return <Text></Text>;
        }
    })();

    const getNoteBody = ( noteId ) => {
        setProcessing(true);
        console.log('gnb', noteId);

        postAjax(
            apiGetNoteBodyPath,
            { "noteId": noteId },
            (data) => {
                setProcessing(false);
                const searchResults = JSON.parse(data);
                console.log('>>>', searchResults);
                setSearchStr(""); // should be same
                setNoteSearchResults([]);
                setActiveNote(searchResults[0]); // a lot of assumptions here
            }
        )
    }
    
    // the weird "MAX(id)" thing below is an artifact from the database schema where I'm selecting the most recent
    // distinct row with the same column value(note name)
    return (
        <View style={ styles.notesModule }>
            <View style={ styles.noteTitle }>
                <View style={ styles.noteSearchWrapper }>
                    <TextInput
                        ref={ searchInput }
                        style={ styles.noteTitleInput }
                        placeholder="search note"
                        onChange={ updateNoteBtn }
                        value={ activeNote ? activeNote.name : searchStr }
                        editable={ processing ? false : true }/>
                    <View style={ processing ? styles.noteBtnProcessing : styles.noteBtn }>
                        { getBtn }
                    </View>
                </View>
                <View style={ !noteSearchResults.length ? styles.displayNone : styles.searchResultsContainer }>
                    <FlatList
                        data={ noteSearchResults }
                        keyExtractor={ item => item.id.toString() }
                        renderItem={ ({ item }) => (
                            <TouchableOpacity style={ styles.noteSearchResult } onPress={ () => getNoteBody(item["MAX(id)"]) }>
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
        flex: 1,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    noteSearchWrapper: {
        alignItems: "stretch",
        justifyContent: "flex-start",
        flexDirection: "row",
        width: getPercent(100),
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    noteTitle: {
        position: "relative",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start"
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
    noteBtnProcessing: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white"
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
        width: getPercent(100)
    },
    noteSearchResult: {
        flex: 1,
        paddingLeft: getPercent(3),
        paddingRight: getPercent(3),
        paddingTop: 5,
        paddingBottom: 5,
        width: getPercent(100),
        borderBottomColor: "#f0f0f0",
        borderBottomWidth: 1
    },
    noteSearchResultText: {
        fontSize: 18
    },
    noteBodyText: {
        paddingLeft: getPercent(3),
        paddingRight: getPercent(3),
        paddingTop: 5,
        paddingBottom: 5,
    }
});

export default Notes;