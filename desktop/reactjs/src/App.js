import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.scss';
import Dock from './components/dock/Dock';
import AppWindow from './components/app-window/AppWindow';
import WebKeyboard from './modules/keyboard/WebKeyboard';

const App = () => {
	const [activeApp, setActiveApp] = useState("");
	const [showKeyboard, setShowKeyboard] = useState(false);
	const [keyboardText, setKeyboardText] = useState({
		fields: {},
		lastActiveField: null
	});

	return (
		<div className={`App ${activeApp === 'notes' ? 'notes-active' : 'drawing-active'} ${showKeyboard ? 'keyboard-active' : ''}`}>
			<Dock activeApp={activeApp} setActiveApp={setActiveApp} />
			<AppWindow activeApp={activeApp} setShowKeyboard={setShowKeyboard} keyboardText={keyboardText} setKeyboardText={setKeyboardText} />
			{showKeyboard && <WebKeyboard keyboardText={keyboardText} setKeyboardText={setKeyboardText} />}
		</div>
	);
}

export default App;
