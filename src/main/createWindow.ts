import electron from 'electron'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

function createWindow(): Promise<electron.BrowserWindow> {
  return new Promise((resolve, reject) => {
    const win = new electron.BrowserWindow({
      backgroundColor: '#21252B',
      frame: true,
      icon: `${__dirname}/static/icon/icon.png`,
      title: 'Browserosaurus',
      titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
      height: 600,
      width: 850,
      show: false,
    })

    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

    win.on('close', (evt) => {
      evt.preventDefault()
      win.hide()
    })

    win.once('ready-to-show', () => {
      win.show()
      // pickerWindow.webContents.openDevTools()
      resolve(win)
    })

    win.once('unresponsive', () => reject(new Error('Window did not load')))
  })
}

export default createWindow
