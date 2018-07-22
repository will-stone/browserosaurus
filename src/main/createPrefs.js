import { BrowserWindow } from 'electron'
import { ACTIVITIES_SET, PREFS_OPEN } from '../config/events'
import eventEmitter from '../utils/eventEmitter'

let prefsWindow = null

/**
 * Create Prefs Window
 *
 * Creates the window used to display the preferences, triggered from the
 * menubar icon.
 * @returns {null}
 */
function createPrefsWindow() {
  return new Promise((resolve, reject) => {
    prefsWindow = new BrowserWindow({
      width: 500,
      height: 146,
      alwaysOnTop: true,
      frame: false,
      hasShadow: true,
      icon: `${__dirname}/../images/icon/icon.png`,
      maximizable: false,
      minimizable: false,
      resizable: false,
      show: false,
      titleBarStyle: 'hidden',
      transparent: true,
      webPreferences: {
        // Enable, among other things, the ResizeObserver
        experimentalFeatures: true,
      },
    })

    prefsWindow.loadURL(`file://${__dirname}/../prefs/index.html`)

    // allow window to be opened again
    prefsWindow.on('close', e => {
      e.preventDefault()
      prefsWindow.hide()
    })

    prefsWindow.once('ready-to-show', () => {
      // prefsWindow.webContents.openDevTools()
      resolve()
    })

    prefsWindow.once('unresponsive', () => {
      console.log('unresponsive')
      reject()
    })

    eventEmitter.on(ACTIVITIES_SET, activities => {
      prefsWindow.webContents.send('activities', activities)
    })

    eventEmitter.on(PREFS_OPEN, () => {
      // Bring to front
      prefsWindow.center()
      prefsWindow.show()
    })
  })
}

export default createPrefsWindow
