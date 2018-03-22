import { BrowserWindow } from 'electron'

import { BROWSERS, URL } from '../config/events'

import eventEmitter from './eventEmitter'

let pickerWindow = null

/**
 * Create Picker Window
 *
 * Creates the window that is used to display browser selection after clicking
 * a link.
 * @param {function} callback - function to run at the end of this one.
 * @returns {null}
 */
function createPickerWindow() {
  return new Promise((resolve, reject) => {
    pickerWindow = new BrowserWindow({
      width: 400,
      height: 50,
      acceptFirstMouse: true,
      alwaysOnTop: true,
      icon: `${__dirname}/../images/icon/icon.png`,
      frame: false,
      resizable: false,
      movable: false,
      show: false,
      title: 'Browserosaurus',
      hasShadow: true,
      // backgroundColor: '#21252b',
      vibrancy: 'ultra-dark',
      minimizable: false,
      maximizable: false,
      closable: false,
      fullscreenable: false,
      transparent: true
    })

    pickerWindow.loadURL(`file://${__dirname}/../renderers/picker/picker.html`)

    pickerWindow.on('close', e => {
      e.preventDefault()
      pickerWindow.hide()
    })

    pickerWindow.on('blur', () => {
      pickerWindow.hide()
    })

    pickerWindow.once('ready-to-show', () => {
      // pickerWindow.webContents.openDevTools()
      resolve()
    })

    pickerWindow.once('unresponsive', () => {
      console.log('unresponsive')
      reject()
    })

    eventEmitter.on(BROWSERS, browsers => {
      pickerWindow.webContents.send('browsers', browsers)
    })

    eventEmitter.on(URL, url => {
      pickerWindow.webContents.send(URL, url)
    })
  })
}

export default createPickerWindow
