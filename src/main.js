'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
const Menu = electron.Menu;
var menuTemplate = require('./menuTemplate');
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, menu;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    menu.items[1].submenu.items[0].enabled = false;
    menu.items[1].submenu.items[1].enabled = false;
    menu.items[3].submenu.items[0].enabled = true;

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  if (!menu) setMenu();

  setDock();

  menu.items[1].submenu.items[0].enabled = true;
  menu.items[1].submenu.items[1].enabled = true;
  menu.items[3].submenu.items[0].enabled = false;
}

function setMenu() {
  menuTemplate[1].submenu[0].click = function () {
    mainWindow.webContents.send('open-file');
  }

  menuTemplate[1].submenu[1].click = function () {
    mainWindow.webContents.send('save-file');
  }

  menuTemplate[3].submenu[0].click = function() {
    if (!mainWindow)
      createWindow();
  }

  menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

function setDock() {
  var dockMenu = Menu.buildFromTemplate([
    { label: 'New Window', click:  menu.items[3].submenu.items[0].click }
  ]);
  app.dock.setMenu(dockMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
