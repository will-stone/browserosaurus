import { BrowserWindow, screen } from 'electron'
import { ACTIVITIES_SET, ACTIVITIES_UPDATED, PICKER_BLUR, URL_RECEIVED } from './config/events'
import { Activity } from './model'
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
function createPickerWindow(openingActivities: Activity[]) {
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
        // TODO: is this needed any more?
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

    eventEmitter.on(ACTIVITIES_SET, (activities: Activity[]) => {
      if (pickerWindow) {
        pickerWindow.webContents.send(ACTIVITIES_UPDATED, activities)
      }
    })

    eventEmitter.on(URL_RECEIVED, (url: string) => {
      if (pickerWindow) {
        const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
        pickerWindow.setPosition(display.bounds.x, 0, false)
        pickerWindow.setSize(display.size.width, display.size.height, false)
        pickerWindow.show()
        pickerWindow.setIgnoreMouseEvents(false)
        pickerWindow.webContents.send(URL_RECEIVED, url)
      }
    })
  })
}

export default createPickerWindow
