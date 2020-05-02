import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, TextInput, Image, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { getPercent } from '../utils/math';

/**
 * PlainJS AJAX until I can install Axios
 */
const postAjax = (url, data, success) => {
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
    const [bodyUpdateTimeout, setBodyUpdateTimeout] = useState(null);
    const baseApiPath = "http://192.168.1.144:5003"; // tried using react-native-dotenv couln't get past 500 error about babel, there's no real risk here
    const apiNoteSearchPath = baseApiPath + "/search-notes";
    const apiGetNoteBodyPath = baseApiPath + "/get-note-body";
    const apiCreateNotePath = baseApiPath + "/save-note";
    const apiDeleteNotePath = baseApiPath + "/delete-note";
    const searchInput = useRef(null);
    const noteBodyTextInput = useRef(null);

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
            if (Object.keys(activeNote) && text !== activeNote.name) {
                setActiveNote({});
            }

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
            }, 500)
        );
    }

    const updateNoteBody = ( event ) => {
        clearTimeout(bodyUpdateTimeout);
        const { text } = event.nativeEvent; // incoming text

        if (processing) {
            setActiveNote(activeNote); // don't change value
        } else {
            setActiveNote({
                name: activeNote.name,
                body: text
            });
        }
            
        setBodyUpdateTimeout(
            setTimeout(() => {
                setTitleBtnMode("processing"); // this is kind of ugly
                setProcessing(true);
                createNote("update", text);
            }, 500));
    }

    // the API has no validation so it's possible to create an empty name/empty body
    // second text parameter is from create so it has the most current value eg. not missing last character
    const createNote = ( type, text ) => {
        postAjax(
            apiCreateNotePath,
            {
                "noteName": searchStr || activeNote.name, // this is actually confusing due to the double use
                "noteBody": text ? text : ""
            },
            (data) => {
                setProcessing(false);
                if (data || type === "update") {
                    setTitleBtnMode("");
                } else {
                    setTitleBtnMode("create"); // fails to create
                }
            }
        )
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
                    searchResults.notes.find(note => note.name === noteTitle)
                    ? setTitleBtnMode("")
                    : setTitleBtnMode("create");
                } else {
                    setTitleBtnMode("create");
                }
            }
        )
    }

    // this could have alternate functionality on display like most recent notes
    const noteBody = (() => {
        const hasActiveNote = Object.keys(activeNote).length;
        if (hasActiveNote) {
            return <TextInput
                multiline
                ref={ noteBodyTextInput }
                placeholder="start typing"
                style={ styles.noteBodyText }
                value={ hasActiveNote ? activeNote.body : "" }
                onChange= { updateNoteBody }
                editable={ processing ? false : true }>
            </TextInput>
        } else {
            return <Text></Text>;
        }
    })();

    const getNoteBody = ( noteId, noteName ) => {
        if (processing) {
            return; // do nothing
        }

        setProcessing(true);

        postAjax(
            apiGetNoteBodyPath,
            { "noteId": noteId },
            (data) => {
                setProcessing(false);
                const searchResults = JSON.parse(data);
                setNoteSearchResults([]);
                setActiveNote({
                    name: noteName,
                    body: searchResults[0].body
                }); // a lot of assumptions here
            }
        )
    }

    const handleSearchBtnClick = () => {
        if (titleBtnMode === "create") {
            createNote();
        }
    }

    const deleteNote = ( noteId, noteName ) => { // noteId optional
        if (processing) {
            return; // do nothing
        }

        setProcessing(true);

        postAjax(
            apiDeleteNotePath,
            { "noteName": noteName }, // not sure if API can use es6, find out
            (data) => {
                setProcessing(false);
                if (data) { // technically no handler for failure
                    setNoteSearchResults(noteSearchResults.filter(note => note.name !== noteName));
                }
            }
        )
    }

    // helps with typing, since actual text input is smaller than display
    // tapping in general area focuses text input
    const focusBody = () => {
        if (Object.keys(noteBodyTextInput).length && noteBodyTextInput.current) {
            noteBodyTextInput.current.focus();
        }
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
                        value={ Object.keys(activeNote).length ? activeNote.name : searchStr }
                        editable={ processing ? false : true }/>
                    <TouchableOpacity style={ processing ? styles.noteBtnProcessing : styles.noteBtn } onPress={ handleSearchBtnClick }>
                        { getBtn }
                    </TouchableOpacity>
                </View>
                <View style={ !noteSearchResults.length ? styles.displayNone : styles.searchResultsContainer }>
                    <FlatList
                        keyboardShouldPersistTaps="always"
                        data={ noteSearchResults }
                        keyExtractor={ item => item.id.toString() }
                        renderItem={ ({ item }) => (
                            <TouchableOpacity style={ styles.noteSearchResult } onPress={ () => getNoteBody(item["MAX(id)"], item.name) }>
                                <View style={ styles.noteSearchResultGroup } selectNote={ item.id }>
                                    <Text style={ styles.noteSearchResultText }>{ item.name }</Text>
                                    <TouchableOpacity>
                                        <Icon
                                            style={ styles.noteSearchResultRemove }
                                            name="remove"
                                            size={ 18 }
                                            color="firebrick"
                                            onPress={ () => deleteNote(item.id, item.name) }/>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        )}/>
                </View>
            </View>
            <TouchableOpacity
                style={ styles.noteBody }
                onPress={ focusBody }>
                { noteBody }
            </TouchableOpacity>
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
        flex: 0,
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
    noteSearchResultGroup: {
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "flex-start",
    },
    noteSearchResultText: {
        fontSize: 20,
        flex: 1
    },
    noteSearchResultRemove: {
        flex: 0,
        paddingLeft: getPercent(3),
        paddingRight: getPercent(3),
        paddingTop: 5,
        paddingBottom: 5,
    },
    noteBody: {
        flex: 1,
        width: getPercent(100),
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flexDirection: "column"
    },
    noteBodyText: {
        paddingLeft: getPercent(3),
        paddingRight: getPercent(3),
        paddingTop: 5,
        paddingBottom: 5,
        minHeight: 18
    }
});

export default Notes;