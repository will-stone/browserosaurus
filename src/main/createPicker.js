import { BrowserWindow } from 'electron'
import { ACTIVITIES_SET, PICKER_BLUR, URL_RECEIVED } from '../config/events'
import eventEmitter from './eventEmitter'

let pickerWindow = null

/**
 * Create Picker Window
 *
 * Creates the window that is used to display activity selection after clicking
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
      closable: false,
      frame: false,
      fullscreenable: false,
      hasShadow: false,
      icon: `${__dirname}/../images/icon/icon.png`,
      maximizable: false,
      minimizable: false,
      movable: false,
      resizable: false,
      show: false,
      title: 'Browserosaurus',
      transparent: true,
    })

    pickerWindow.loadURL(`file://${__dirname}/../picker/picker.html`)

    pickerWindow.on('close', e => {
      e.preventDefault()
      pickerWindow.hide()
    })

    pickerWindow.on('blur', () => {
      pickerWindow.webContents.send(PICKER_BLUR)
    })

    pickerWindow.once('ready-to-show', () => {
      // pickerWindow.webContents.openDevTools()
      resolve()
    })

    pickerWindow.once('unresponsive', () => {
      console.log('unresponsive')
      reject()
    })

    eventEmitter.on(ACTIVITIES_SET, activities => {
      pickerWindow.webContents.send('activities', activities)
    })

    eventEmitter.on(URL_RECEIVED, url => {
      pickerWindow.webContents.send(URL_RECEIVED, url)
    })
  })
}

export default createPickerWindow
