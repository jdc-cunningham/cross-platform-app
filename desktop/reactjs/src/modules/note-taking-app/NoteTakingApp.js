import React, { useRef } from 'react';
import './NoteTakingApp.scss';

const NoteTakingApp = (props) => {
    const noteNameInput = useRef(null);
    const noteCreateBtn = useRef(null);
    const noteBodyInput = useRef(null);

    return (
        <div className="cpa__module" id="module--note-taking-app">
            <div className="module-notes__header">
                <input type="text" placeholder="search note" className="module-notes__search-bar"/>
            </div>
            <div className="module-notes__body">
                <textarea className="modules-notes__text-area" placeholder="write..."></textarea>
            </div>
        </div>
    )
}

export default NoteTakingApp;