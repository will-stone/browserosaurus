import electron from 'electron'
import isDev from 'electron-is-dev'
import path from 'path'

import { PROTOCOL_STATUS_RETRIEVED } from './events'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

function createWindow(): Promise<electron.BrowserWindow> {
  return new Promise((resolve, reject) => {
    const bWindow = new electron.BrowserWindow({
      frame: false,
      icon: path.join(__dirname, '/static/icon/icon.png'),
      title: 'Browserosaurus',
      webPreferences: {
        additionalArguments: [],
        nodeIntegration: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        enableRemoteModule: false,
      },
      height: 300,
      width: 1000,
      show: false,
      minimizable: false,
      maximizable: false,
      fullscreen: false,
      fullscreenable: false,
      movable: false,
      resizable: false,
      transparent: true,
      hasShadow: false,
    })

    bWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

    bWindow.setVisibleOnAllWorkspaces(true)

    bWindow.on('hide', () => {
      electron.app.hide()
    })

    bWindow.on('close', (event_) => {
      event_.preventDefault()
      bWindow.hide()
    })

    bWindow.on('show', () => {
      bWindow.setIgnoreMouseEvents(false)
      bWindow.center()
      // There isn't a listener for default protocol client, therefore the check
      // is made each time the app is brought into focus.
      bWindow.webContents.send(
        PROTOCOL_STATUS_RETRIEVED,
        electron.app.isDefaultProtocolClient('http'),
      )
    })

    bWindow.on('blur', () => {
      if (!isDev) {
        bWindow.hide()
      }
    })

    bWindow.webContents.on('did-finish-load', () => {
      // pickerWindow.webContents.openDevTools()
      resolve(bWindow)
    })

    bWindow.once('unresponsive', () => reject(new Error('Window did not load')))
  })
}

export default createWindow
