import { BrowserWindow } from 'electron'

import { BROWSERS, PREFS } from '../config/events'

import eventEmitter from './eventEmitter'

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
      icon: `${__dirname}/../images/icon/icon.png`,
      resizable: false,
      show: false,
      alwaysOnTop: true,
      frame: true,
      hasShadow: true,
      minimizable: false,
      maximizable: false,
      titleBarStyle: 'hidden',
      backgroundColor: '#21252b'
    })

    prefsWindow.loadURL(`file://${__dirname}/../renderers/prefs/prefs.html`)

    // allow window to be opened again
    prefsWindow.on('close', e => {
      e.preventDefault()
      prefsWindow.hide()
    })

    prefsWindow.once('ready-to-show', () => {
      resolve()
    })

    prefsWindow.once('unresponsive', () => {
      console.log('unresponsive')
      reject()
    })

    eventEmitter.on(BROWSERS, browsers => {
      prefsWindow.webContents.send('browsers', browsers)
    })

    eventEmitter.on(PREFS, browsers => {
      // Bring to front
      prefsWindow.center()
      prefsWindow.show()
    })
  })
}

export default createPrefsWindow
