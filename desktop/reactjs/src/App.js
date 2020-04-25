import React, { useState } from 'react';
// import logo from './logo.svg';
import './App.scss';
import Dock from './components/dock/Dock';
import AppWindow from './components/app-window/AppWindow';

const App = () => {
	const [activeApp, setActiveApp] = useState("");

	return (
		<div className="App">
			<Dock activeApp={ activeApp } setActiveApp={ setActiveApp } />
			<AppWindow activeApp={ activeApp } />
		</div>
	);
}

export default App;
