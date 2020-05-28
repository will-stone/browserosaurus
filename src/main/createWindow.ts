import { app, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'
import path from 'path'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

function createWindow(): Promise<BrowserWindow> {
  return new Promise((resolve, reject) => {
    const win = new BrowserWindow({
      backgroundColor: '#212428',
      frame: false,
      icon: path.join(__dirname, '/static/icon/icon.png'),
      title: 'Browserosaurus',
      webPreferences: {
        additionalArguments: [],
        nodeIntegration: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
      height: 225,
      width: 800,
      show: false,
      minimizable: false,
      maximizable: false,
      fullscreen: false,
      fullscreenable: false,
      movable: false,
      resizable: false,
    })

    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

    win.setVisibleOnAllWorkspaces(true)

    win.on('close', (event_) => {
      event_.preventDefault()
      win.hide()
      app.hide()
    })

    win.on('show', () => {
      win.center()
    })

    win.on('blur', () => {
      if (!isDev) {
        win.hide()
        app.hide()
      }
    })

    win.once('ready-to-show', () => {
      // pickerWindow.webContents.openDevTools()
      resolve(win)
    })

    win.once('unresponsive', () => reject(new Error('Window did not load')))
  })
}

export default createWindow
