import { app, BrowserWindow, screen } from 'electron'
import path from 'path'

import { database } from './database'
import {
  changedPickerWindowBounds,
  gotDefaultBrowserStatus,
} from './state/actions'
import { dispatch } from './state/store'

declare const PICKER_WINDOW_WEBPACK_ENTRY: string
declare const PICKER_WINDOW_PRELOAD_WEBPACK_ENTRY: string
declare const PREFS_WINDOW_WEBPACK_ENTRY: string
declare const PREFS_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Prevents garbage collection
let pickerWindow: BrowserWindow | null | undefined
let prefsWindow: BrowserWindow | null | undefined

async function createWindows(): Promise<void> {
  prefsWindow = new BrowserWindow({
    // Only show on demand
    show: false,

    // Chrome
    center: true,
    fullscreen: false,
    fullscreenable: false,
    height: 500,
    maximizable: false,
    minimizable: false,
    resizable: false,
    titleBarStyle: 'hidden',
    transparent: true,
    vibrancy: 'window',
    width: 600,

    // Meta
    icon: path.join(__dirname, '/static/icon/icon.png'),
    title: 'Preferences',

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInSubFrames: false,
      nodeIntegrationInWorker: false,
      preload: PREFS_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  prefsWindow.on('hide', () => {
    prefsWindow?.hide()
  })

  prefsWindow.on('close', (event_) => {
    event_.preventDefault()
    prefsWindow?.hide()
  })

  prefsWindow.on('show', () => {
    // There isn't a listener for default protocol client, therefore the check
    // is made each time the window is brought into focus.
    dispatch(gotDefaultBrowserStatus(app.isDefaultProtocolClient('http')))
  })

  const height = database.get('height')

  pickerWindow = new BrowserWindow({
    alwaysOnTop: true,
    center: true,
    frame: true,
    fullscreen: false,
    fullscreenable: false,
    hasShadow: true,
    height,
    icon: path.join(__dirname, '/static/icon/icon.png'),
    maximizable: false,
    maxWidth: 250,
    minHeight: 112,
    minimizable: false,
    minWidth: 250,
    movable: false,
    resizable: true,
    show: false,
    title: 'Browserosaurus',
    titleBarStyle: 'hidden',
    transparent: true,
    vibrancy: 'popover',
    visualEffectState: 'active',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInSubFrames: false,
      nodeIntegrationInWorker: false,
      preload: PICKER_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    width: 250,
  })

  pickerWindow.setWindowButtonVisibility(false)

  pickerWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  pickerWindow.on('hide', () => {
    pickerWindow?.hide()
  })

  pickerWindow.on('close', (event_) => {
    event_.preventDefault()
    pickerWindow?.hide()
  })

  pickerWindow.on('resize', () => {
    if (pickerWindow) {
      dispatch(changedPickerWindowBounds(pickerWindow.getBounds()))
    }
  })

  pickerWindow.on('blur', () => {
    pickerWindow?.hide()
  })

  await Promise.all([
    prefsWindow.loadURL(PREFS_WINDOW_WEBPACK_ENTRY),
    pickerWindow.loadURL(PICKER_WINDOW_WEBPACK_ENTRY),
  ])
}

function showPickerWindow(): void {
  if (pickerWindow) {
    const displayBounds = screen.getDisplayNearestPoint(
      screen.getCursorScreenPoint(),
    ).bounds

    const displayEnd = {
      x: displayBounds.x + displayBounds.width,
      y: displayBounds.y + displayBounds.height,
    }

    const mousePoint = screen.getCursorScreenPoint()

    const bWindowBounds = pickerWindow.getBounds()

    const nudge = {
      x: -125,
      y: -30,
    }

    const inWindowPosition = {
      x:
        mousePoint.x + bWindowBounds.width + nudge.x > displayEnd.x
          ? displayEnd.x - bWindowBounds.width
          : mousePoint.x + nudge.x,
      y:
        mousePoint.y + bWindowBounds.height + nudge.y > displayEnd.y
          ? displayEnd.y - bWindowBounds.height
          : mousePoint.y + nudge.y,
    }

    pickerWindow.setPosition(inWindowPosition.x, inWindowPosition.y, false)

    pickerWindow.show()
  }
}

function showPrefsWindow(): void {
  prefsWindow?.show()
}

export {
  createWindows,
  pickerWindow,
  prefsWindow,
  showPickerWindow,
  showPrefsWindow,
}
