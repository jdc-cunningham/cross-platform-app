import React from 'react';
import './AppWindow.scss';

// modules
import NoteTakingModule from './../../modules/notes/NoteTakingModule' ;
import CanvasDrawingModule from './../../modules/drawing/CanvasDrawingModule';

const AppWindow = (props) => {
    const activeApp = props.activeApp;

    const renderModule = (activeApp) => {
        switch(activeApp) {
            case "notes":
                return <NoteTakingModule />;
            case "drawing":
                return <CanvasDrawingModule />;
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