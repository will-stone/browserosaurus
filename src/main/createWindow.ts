import electron from 'electron'
import path from 'path'

import { PROTOCOL_STATUS_RETRIEVED } from './events'
import { store } from './store'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

function createWindow(): Promise<electron.BrowserWindow> {
  const bounds = store.get('bounds')

  return new Promise((resolve, reject) => {
    const bWindow = new electron.BrowserWindow({
      frame: true,
      titleBarStyle: 'hiddenInset',
      icon: path.join(__dirname, '/static/icon/icon.png'),
      title: 'Browserosaurus',
      webPreferences: {
        additionalArguments: [],
        nodeIntegration: true,
        contextIsolation: false,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        enableRemoteModule: false,
      },
      x: bounds?.x,
      y: bounds?.y,
      height: bounds?.height || 168,
      minHeight: 168,
      width: bounds?.width || 790,
      minWidth: 790,
      show: false,
      minimizable: true,
      maximizable: true,
      fullscreen: true,
      fullscreenable: false,
      movable: true,
      resizable: true,
      transparent: false,
      hasShadow: true,
      backgroundColor: '#1A202C',
    })

    bWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

    bWindow.on('hide', () => {
      electron.app.hide()
    })

    bWindow.on('close', (event_) => {
      event_.preventDefault()
      bWindow.hide()
    })

    bWindow.on('show', () => {
      // There isn't a listener for default protocol client, therefore the check
      // is made each time the app is brought into focus.
      bWindow.webContents.send(
        PROTOCOL_STATUS_RETRIEVED,
        electron.app.isDefaultProtocolClient('http'),
      )
    })

    bWindow.webContents.on('did-finish-load', () => {
      // bWindow.webContents.openDevTools()
      resolve(bWindow)
    })

    bWindow.once('unresponsive', () => reject(new Error('Window did not load')))

    bWindow.on('resize', () => {
      store.set('bounds', bWindow.getBounds())
    })

    bWindow.on('moved', () => {
      store.set('bounds', bWindow.getBounds())
    })
  })
}

export default createWindow
