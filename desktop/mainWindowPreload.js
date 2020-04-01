// this is catching the data from the addWindow.html form
const electron = require('electron');
const { ipcRenderer } = electron;

ipcRenderer.on('todo:add', (e, todoItemVal) => {
    // this should exist because function is called after small window is launched
    const dispTarget = document.getElementById('display-target');
    dispTarget.innerText += todoItemVal;
    dispTarget.innerHTML += '<br>';
});