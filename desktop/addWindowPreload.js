/**
 * this code was initially inside the addWindow.html file, but after some Googlin'
 * put in preload file due to security issues
 * see here: https://stackoverflow.com/questions/44391448/electron-require-is-not-defined/57049268#57049268
 */
const electron = require('electron');
const { ipcRenderer } = electron;

// bind global event listener, but scoped in functionality
window.sendAddWindowData = (todoInputVal) => {
    ipcRenderer.send('todoForm:add', todoInputVal);
};