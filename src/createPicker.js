import { BrowserWindow } from 'electron'
import { ACTIVITIES_SET, ACTIVITIES_UPDATED, PICKER_BLUR, URL_RECEIVED } from './config/events'
import eventEmitter from './utils/eventEmitter'

let pickerWindow = null

/**
 * Create Picker Window
 *
 * Creates the window that is used to display activity selection after clicking
 * a link.
 * @param {function} callback - function to run at the end of this one.
 * @returns {null}
 */
function createPickerWindow(openingActivities) {
  return new Promise((resolve, reject) => {
    pickerWindow = new BrowserWindow({
      width: 400,
      height: 50,
      acceptFirstMouse: true,
      alwaysOnTop: true,
      frame: false,
      hasShadow: false,
      icon: `${__dirname}/images/icon/icon.png`,
      closable: false,
      maximizable: false,
      minimizable: false,
      fullscreenable: false,
      movable: false,
      resizable: false,
      show: false,
      title: 'Browserosaurus',
      transparent: true,
      titleBarStyle: 'hidden',
      webPreferences: {
        // Enable, among other things, the ResizeObserver
        experimentalFeatures: true,
        nodeIntegration: true,
      },
    })

    pickerWindow.loadURL(`file://${__dirname}/picker/index.html`)

    pickerWindow.on('close', e => {
      e.preventDefault()
      pickerWindow.hide()
    })

    pickerWindow.on('blur', () => {
      pickerWindow.webContents.send(PICKER_BLUR)
    })

    pickerWindow.once('ready-to-show', () => {
      // pickerWindow.webContents.openDevTools()
      pickerWindow.webContents.send(ACTIVITIES_UPDATED, openingActivities)
      resolve()
    })

    pickerWindow.once('unresponsive', () => {
      console.log('unresponsive')
      reject()
    })

    eventEmitter.on(ACTIVITIES_SET, activities => {
      pickerWindow.webContents.send(ACTIVITIES_UPDATED, activities)
    })

    eventEmitter.on(URL_RECEIVED, url => {
      pickerWindow.webContents.send(URL_RECEIVED, url)
    })
  })
}

export default createPickerWindow
