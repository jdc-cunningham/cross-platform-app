const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu } = electron;
const macPlatform = process.platform == 'darwin';

let mainWindow;
let addWindow;

// listen for app to be ready
app.on('ready', () => {
    // create new window
    mainWindow = new BrowserWindow({});

    // load html file into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // quit app when closed
    mainWindow.on('closed', () => {
        app.quit();
    });

    // build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // insert menu
    Menu.setApplicationMenu(mainMenu);
});

// handle create add window
const createAddWindow = () => {
    // create new window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add todo item'
    });

    // load html file into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // reduce memory usage
    addWindow.on('close', () => {
        addWindow = null;
    });
};

// create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Todo',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear todos',
            },
            {
                label: 'Quit',
                accelerator: macPlatform ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

// if Mac add empty object to menu
if (macPlatform) {
    mainMenuTemplate.unshift({});
}

// add dev tools menu itme if not in prod
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label:'Dev tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: macPlatform ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) { // want devtools to show up on active window
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}