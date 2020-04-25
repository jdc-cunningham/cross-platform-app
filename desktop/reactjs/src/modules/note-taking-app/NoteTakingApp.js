import React, { useState, useRef } from 'react';
import './NoteTakingApp.scss';
import axios from 'axios';

const NoteTakingApp = (props) => {
    const [notesModuleState, setNotesModuleState] = useState({
        searchStr: "",
        activeNote: null,
        createMode: false,
        creatingNote: false
    });

    const noteNameInput = useRef(null);
    const noteCreateBtn = useRef(null);
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

    const searchNotes = () => {
        const searchStr = noteNameInput.current.value; // this could be taken directly/val passed as param
        if (!searchStr) { // this is questionable eg. need to update state
            setNotesModuleState(prev => ({
                ...prev,
                createMode: false
            }));
        }

        clearTimeout(searchApiTimeout); // ugh these naming convetions are bad ahhh
        searchApiTimeout = setTimeout(() => {
            axios.post(searchNotesApiPath, {
                noteQueryStr: searchStr
            })
            .then((res) => { // pointing this out I use both .then and async/await
                console.log(res);
                if (res.status === 200) {
                    if (res.data.notes.length) {
                        // show results
                    } else {
                        // new note, show create button
                        setNotesModuleState(prev => ({
                            ...prev,
                            createMode: true
                        }));
                    }
                } else {
                    console.log('search failed'); // this sucks need global modal or something, or subtle error
                }
            })
            .catch((err) => {
                console.log(err, err.response);
            });
        }, 1000);
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
            console.log(res);
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
                console.log('search failed'); // this sucks need global modal or something, or subtle error
            }
        })
        .catch((err) => {
            console.log(err, err.response);
        });
    }

    return (
        <div className="cpa__module" id="module--note-taking-app">
            <div className={ !notesModuleState.createMode ? "module-notes__header" : "module-notes__header create" }>
                <input
                    ref={ noteNameInput }
                    onKeyUp={ searchNotes }
                    type="text"
                    placeholder="search note"
                    className="module-notes__search-bar"
                    defaultValue={ notesModuleState.activeNote ? notesModuleState.activeNote.name : notesModuleState.searchStr }
                    disabled={ notesModuleState.creatingNote }/>
                <button
                    type="button"
                    className="module-notes__search-bar-create-btn"
                    onClick={ createNote }
                    disabled={ notesModuleState.creatingNote }>Create</button>
            </div>
            <div className="module-notes__body">
                <textarea
                    ref={ noteBodyInput }
                    className="modules-notes__text-area"
                    placeholder="write..."
                    defaultValue={ !notesModuleState.activeNote ? "" : notesModuleState.activeNote.body }
                    disabled={ notesModuleState.creatingNote }></textarea>
            </div>
        </div>
    )
}

export default NoteTakingApp;