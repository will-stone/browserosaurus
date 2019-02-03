import { BrowserWindow } from 'electron'
import { ACTIVITIES_SET, ACTIVITIES_UPDATED, PICKER_BLUR, URL_RECEIVED } from './config/events'
import { IActivity } from './model'
import eventEmitter from './utils/eventEmitter'

let pickerWindow: BrowserWindow | null = null

/**
 * Create Picker Window
 *
 * Creates the window that is used to display activity selection after clicking
 * a link.
 * @param {function} callback - function to run at the end of this one.
 * @returns {null}
 */
function createPickerWindow(openingActivities: IActivity[]) {
  return new Promise((resolve, reject) => {
    pickerWindow = new BrowserWindow({
      acceptFirstMouse: true,
      alwaysOnTop: true,
      closable: false,
      frame: false,
      fullscreenable: false,
      hasShadow: false,
      height: 50,
      icon: `${__dirname}/images/icon/icon.png`,
      maximizable: false,
      minimizable: false,
      movable: false,
      resizable: false,
      show: false,
      title: 'Browserosaurus',
      titleBarStyle: 'customButtonsOnHover',
      transparent: true,
      webPreferences: {
        // Enable, among other things, the ResizeObserver
        experimentalFeatures: true,
        nodeIntegration: true,
      },
      width: 400,
    })

    pickerWindow.loadURL(`file://${__dirname}/picker/index.html`)

    pickerWindow.on('close', e => {
      e.preventDefault()
      if (pickerWindow) {
        pickerWindow.hide()
      }
    })

    pickerWindow.on('blur', () => {
      if (pickerWindow) {
        pickerWindow.webContents.send(PICKER_BLUR)
      }
    })

    pickerWindow.once('ready-to-show', () => {
      if (pickerWindow) {
        // pickerWindow.webContents.openDevTools()
        pickerWindow.webContents.send(ACTIVITIES_UPDATED, openingActivities)
        resolve()
      }
    })

    pickerWindow.once('unresponsive', () => {
      reject()
    })

    eventEmitter.on(ACTIVITIES_SET, (activities: IActivity[]) => {
      if (pickerWindow) {
        pickerWindow.webContents.send(ACTIVITIES_UPDATED, activities)
      }
    })

    eventEmitter.on(URL_RECEIVED, (url: string) => {
      if (pickerWindow) {
        pickerWindow.webContents.send(URL_RECEIVED, url)
      }
    })
  })
}

export default createPickerWindow
