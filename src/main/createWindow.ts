import electron from 'electron'
import path from 'path'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

function createWindow(): Promise<electron.BrowserWindow> {
  return new Promise((resolve, reject) => {
    const win = new electron.BrowserWindow({
      backgroundColor: '#1e1e1e',
      frame: true,
      icon: path.join(__dirname, '/static/icon/icon.png'),
      title: 'Browserosaurus',
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        additionalArguments: [],
        nodeIntegration: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
      height: 700,
      minHeight: 700,
      width: 800,
      minWidth: 800,
      show: false,
      fullscreen: false,
      fullscreenable: false,
    })

    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

    win.setVisibleOnAllWorkspaces(true)

    win.on('close', (event_) => {
      event_.preventDefault()
      win.hide()
    })

    win.once('ready-to-show', () => {
      // pickerWindow.webContents.openDevTools()
      resolve(win)
    })

    win.once('unresponsive', () => reject(new Error('Window did not load')))
  })
}

export default createWindow
