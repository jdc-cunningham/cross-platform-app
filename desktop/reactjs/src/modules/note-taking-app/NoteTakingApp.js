import React, { useState, useRef } from 'react';
import './NoteTakingApp.scss';
import axios from 'axios';

const NoteTakingApp = (props) => {
    const [activeNote, setActiveNote] = useState(null); // object of {name, body} both strings
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
    const searchApiBasePath = window.location.href.indexOf('localhost') !== -1 // this should use production flag
        ? process.env.REACT_APP_SEARCH_API_BASE_PATH_DEV
        : process.env.REACT_APP_SEARCH_API_BASE_PATH;
    const searchApiPath = searchApiBasePath + '/search-notes';

    const searchApi = () => {
        const searchStr = noteNameInput.current.value; // this could be taken directly/val passed as param
        if (!searchStr) { // this is questionable eg. need to update state
            return;
        }

        clearTimeout(searchApiTimeout);
        searchApiTimeout = setTimeout(() => {
            axios.post(searchApiPath, {
                noteQueryStr: searchStr
            })
            .then((res) => { // pointing this out I use both .then and async/await
                console.log(res);
            })
            .catch((err) => {
                console.log(err, err.response);
            });
        }, 1000);
    }

    return (
        <div className="cpa__module" id="module--note-taking-app">
            <div className="module-notes__header">
                <input
                    ref={ noteNameInput }
                    onKeyUp={ searchApi }
                    type="text"
                    placeholder="search note"
                    className="module-notes__search-bar"
                    defaultValue={ !activeNote ? "" : activeNote.name }/>
                <button
                    type="button"
                    className="module-notes__search-bar-create-btn">Create</button>
            </div>
            <div className="module-notes__body">
                <textarea
                    ref={ noteBodyInput }
                    className="modules-notes__text-area"
                    placeholder="write..."
                    defaultValue={ !activeNote ? "" : activeNote.body }></textarea>
            </div>
        </div>
    )
}

export default NoteTakingApp;