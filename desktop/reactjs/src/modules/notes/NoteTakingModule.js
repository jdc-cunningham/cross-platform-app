import React, { useState, useRef } from 'react';
import './NoteTakingModule.scss';
import axios from 'axios';

const NoteTakingApp = (props) => {
    const [notesModuleState, setNotesModuleState] = useState({
        searchStr: "",
        searchResults: [],
        activeNote: null,
        createMode: false,
        creatingNote: false
    });

    const noteNameInput = useRef(null);
    const noteBodyInput = useRef(null);

    /**
     * Info about this app/workflow
     * The user types into the search-bar and this checks if the note name matches an existing
     * if not, create(show create button)
     * if there are results, show rows below the search
     * when a note is created or search result is clicked, that is set as the current state/note being used
     * the UI is using absolute positioning for items that dynamically appear eg. the create button/result rows
     */

    let searchApiTimeout;
    const notesApiBasePath = window.location.href.indexOf('localhost') !== -1 // this should use production flag
        ? process.env.REACT_APP_SEARCH_API_BASE_PATH_DEV
        : process.env.REACT_APP_SEARCH_API_BASE_PATH;
    const searchNotesApiPath = notesApiBasePath + '/search-notes';
    const createNoteApiPath = notesApiBasePath + '/save-note';
    const getNoteBodyApiPath = notesApiBasePath + '/get-note-body';

    const searchNotes = () => {
        setNotesModuleState(prev => ({
            ...prev,
            searchStr: noteNameInput.current.value
        }));

        const searchStr = noteNameInput.current.value; // this could be taken directly/val passed as param
        if (!searchStr) { // this is questionable eg. need to update state
            setNotesModuleState(prev => ({
                ...prev,
                createMode: false,
                searchStr: "",
                activeNote: null,
                searchResults: []
            }));
            return;
        }

        clearTimeout(searchApiTimeout); // ugh these naming convetions are bad ahhh
        searchApiTimeout = setTimeout(() => {
            axios.post(searchNotesApiPath, {
                noteQueryStr: searchStr
            })
            .then((res) => { // pointing this out I use both .then and async/await
                if (res.status === 200) {
                    if (res.data.notes.length) {
                        // show results
                        setNotesModuleState(prev => ({
                            ...prev,
                            createMode: false,
                            searchResults: res.data.notes
                        }));
                    } else {
                        // new note, show create button
                        setNotesModuleState(prev => ({
                            ...prev,
                            createMode: true,
                            searchResults: []
                        }));
                    }
                } else {
                    console.log('search failed'); // this sucks need global modal or something, or subtle error
                }
            })
            .catch((err) => {
                console.log(err, err.response);
            });
        }, 250);
    }

    const createNote = () => {
        setNotesModuleState(prev => ({
            ...prev,
            creatingNote: true
        }));

        const noteName = noteNameInput.current.value;
        const noteBody = noteBodyInput.current.value; // can be empty

        if (!noteName) {
            alert("Note name cannot be empty"); // this actually should never happen
        }

        axios.post(createNoteApiPath, {
            noteName,
            noteBody
        })
        .then((res) => { // pointing this out I use both .then and async/await
            if (res.status === 200) {
                setNotesModuleState(prev => ({
                    ...prev,
                    searchStr: "",
                    activeNote: {
                        name: notesModuleState.searchStr,
                        body: noteBodyInput.current.value
                    },
                    createMode: false,
                    creatingNote: false
                }));
            } else {
                console.log('note creation failed'); // this sucks need global modal or something, or subtle error
            }
        })
        .catch((err) => {
            console.log(err, err.response);
        });
    }

    const getNoteBody = (noteId) => {
        axios.post(getNoteBodyApiPath, {
            noteId
        })
        .then((res) => { // pointing this out I use both .then and async/await
            if (res.status === 200 && res.data.length) {
                setActiveNote(res.data[0]);
            } else {
                console.log('failed to retrieve note body');
            }
        })
        .catch((err) => {
            console.log(err, err.response);
        });
    }

    /**
     * Expects object: {name, body} both property values are strings
     * @param {Object} noteData
     */
    const setActiveNote = (noteData) => {
        setNotesModuleState(prev => ({
            ...prev,
            searchStr: "",
            searchResults: [],
            activeNote: {
                name: noteData.name,
                body: noteData.body
            }
        }));
    }

    let updateNoteTimeout;
    const updateNote = () => {
        clearTimeout(updateNoteTimeout);
        setNotesModuleState(prev => ({
            ...prev,
            activeNote: {
                name: notesModuleState.activeNote.name,
                body: noteBodyInput.current.value
            }
        }));

        updateNoteTimeout = setTimeout(() => {
            // almost same copy as createNote but different UI behavior
            const noteName = noteNameInput.current.value;
            const noteBody = noteBodyInput.current.value;

            axios.post(createNoteApiPath, {
                noteName,
                noteBody
            })
            .then((res) => {
                if (res.status === 200) {
                    setNotesModuleState(prev => ({
                        ...prev,
                        activeNote: {
                            name: notesModuleState.activeNote.name,
                            body: noteBodyInput.current.value
                        }
                    }));
                } else {
                    console.log('save failed'); // this sucks need global modal or something, or subtle error
                }
            })
            .catch((err) => {
                console.log(err, err.response);
            });
        }, 250);
    }

    const getNoteNameValue = () => {
        if (notesModuleState.searchStr) {
            return notesModuleState.searchStr;
        }
        
        if (!!notesModuleState.activeNote) {
            return notesModuleState.activeNote.name;
        }
        
        return "";
    }

    return (
        <div className="cpa__module" id="module--note-taking-module">
            <div className={ !notesModuleState.createMode ? "module-notes__header" : "module-notes__header create" }>
                <input
                    ref={ noteNameInput }
                    onChange={ searchNotes }
                    type="text"
                    placeholder="search note"
                    className="module-notes__search-bar"
                    value={ getNoteNameValue() }
                    disabled={ notesModuleState.creatingNote }/>
                <button
                    type="button"
                    className="module-notes__search-bar-create-btn"
                    onClick={ createNote }
                    disabled={ notesModuleState.creatingNote }>Create</button>
                    { !notesModuleState.searchResults.length
                        ? null
                        : <div className="module-notes__search-bar-results">
                            { notesModuleState.searchResults.map(note => (
                                <div
                                    key={ note.id }
                                    className="module-notes__search-bar-result"
                                    // this is an ugly artifact from this SELECT MAX(id) query to get the distinct row but latest version
                                    onClick={ () => getNoteBody(note['MAX(id)']) }>{ note.name }</div>
                            )) }
                        </div> }
            </div>
            <div className="module-notes__body">
                <textarea
                    ref={ noteBodyInput }
                    className="modules-notes__text-area"
                    placeholder="write..."
                    value={ notesModuleState.activeNote ? notesModuleState.activeNote.body : "" }
                    disabled={ notesModuleState.creatingNote }
                    onChange={ updateNote }></textarea>
            </div>
        </div>
    )
}

export default NoteTakingApp;