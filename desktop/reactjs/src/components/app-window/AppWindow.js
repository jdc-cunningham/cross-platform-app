import React from 'react';
import './AppWindow.scss';

// modules
import NoteTakingApp from './../../modules/note-taking-app/NoteTakingApp' ;

const AppWindow = (props) => {
    const activeApp = props.activeApp;

    const renderModule = (activeApp) => {
        switch(activeApp) {
            case "notes":
                return <NoteTakingApp />;
            default:
                return <h2>Select an app on the left</h2>
        }
    }

    return (
        <div className="cpa__app-window">
            { renderModule(activeApp) }
        </div>
    )
}

export default AppWindow;