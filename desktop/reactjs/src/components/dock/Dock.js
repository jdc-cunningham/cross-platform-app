import React from 'react';
import './Dock.scss';

const Dock = (props) => {
    const setActiveApp = props.setActiveApp;

    return (
        <div className="cpa__dock">
            <div className="cpa__dock-app-icons">
                <div
                    className="cpa__dock-app-icon"
                    id="notes"
                    onClick={ () => setActiveApp("notes") }></div>
                <div
                    className="cpa__dock-app-icon"
                    id="draw"
                    onClick={ () => setActiveApp("drawing") }></div>
            </div>
            <button type="button" className="cpa__dock-plus-icon"></button>
        </div>
    )
}

export default Dock;