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
    height: 500,
    width: 600,
    resizable: false,
    center: true,
    minimizable: false,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false,
    transparent: true,
    titleBarStyle: 'hidden',
    vibrancy: 'window',

    // Meta
    icon: path.join(__dirname, '/static/icon/icon.png'),
    title: 'Preferences',

    webPreferences: {
      preload: PREFS_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
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
    frame: true,
    icon: path.join(__dirname, '/static/icon/icon.png'),
    title: 'Browserosaurus',
    webPreferences: {
      preload: PICKER_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
    },
    center: true,
    height,
    minHeight: 112,
    width: 250,
    maxWidth: 250,
    minWidth: 250,
    show: false,
    minimizable: false,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false,
    movable: false,
    resizable: true,
    transparent: true,
    hasShadow: true,
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    alwaysOnTop: true,
    vibrancy: 'popover',
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
