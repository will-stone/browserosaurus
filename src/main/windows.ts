import { app, BrowserWindow, screen } from 'electron'
import path from 'path'

import {
  gotDefaultBrowserStatus,
  tWindowBoundsChanged,
} from '../shared/state/actions'
import { dispatch } from './state/store'
import { storage } from './storage'

declare const TILES_WINDOW_WEBPACK_ENTRY: string
declare const TILES_WINDOW_PRELOAD_WEBPACK_ENTRY: string
declare const PREFS_WINDOW_WEBPACK_ENTRY: string
declare const PREFS_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Prevents garbage collection
export let tWindow: BrowserWindow | null | undefined
export let pWindow: BrowserWindow | null | undefined

export async function createWindows(): Promise<void> {
  pWindow = new BrowserWindow({
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
      enableRemoteModule: false,
    },
  })

  pWindow.on('hide', () => {
    pWindow?.hide()
  })

  pWindow.on('close', (event_) => {
    event_.preventDefault()
    pWindow?.hide()
  })

  pWindow.on('show', () => {
    // There isn't a listener for default protocol client, therefore the check
    // is made each time the window is brought into focus.
    dispatch(gotDefaultBrowserStatus(app.isDefaultProtocolClient('http')))
  })

  const width = storage.get('width')
  const height = storage.get('height')

  tWindow = new BrowserWindow({
    frame: true,
    icon: path.join(__dirname, '/static/icon/icon.png'),
    title: 'Browserosaurus',
    webPreferences: {
      preload: TILES_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    center: true,
    height,
    minHeight: height,
    width,
    minWidth: width,
    show: false,
    minimizable: false,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false,
    movable: true,
    resizable: true,
    transparent: true,
    hasShadow: true,
    vibrancy: 'tooltip',
    visualEffectState: 'active',
    titleBarStyle: 'hidden',
    alwaysOnTop: true,
  })

  tWindow.setWindowButtonVisibility(false)

  tWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  tWindow.on('hide', () => {
    tWindow?.hide()
  })

  tWindow.on('close', (event_) => {
    event_.preventDefault()
    tWindow?.hide()
  })

  tWindow.on('resize', () => {
    if (tWindow) {
      dispatch(tWindowBoundsChanged(tWindow.getBounds()))
    }
  })

  tWindow.on('blur', () => {
    tWindow?.hide()
  })

  await Promise.all([
    pWindow.loadURL(PREFS_WINDOW_WEBPACK_ENTRY),
    tWindow.loadURL(TILES_WINDOW_WEBPACK_ENTRY),
  ])
}

export function showTWindow(): void {
  if (tWindow) {
    const displayBounds = screen.getDisplayNearestPoint(
      screen.getCursorScreenPoint(),
    ).bounds

    const displayEnd = {
      x: displayBounds.x + displayBounds.width,
      y: displayBounds.y + displayBounds.height,
    }

    const mousePoint = screen.getCursorScreenPoint()

    const bWindowBounds = tWindow.getBounds()

    const bWindowEdges = {
      right: mousePoint.x + bWindowBounds.width,
      bottom: mousePoint.y + bWindowBounds.height,
    }

    const nudge = {
      x: 50,
      y: 10,
    }

    const inWindowPosition = {
      x:
        bWindowEdges.right > displayEnd.x + nudge.x
          ? displayEnd.x - bWindowBounds.width
          : mousePoint.x - nudge.x,
      y:
        bWindowEdges.bottom > displayEnd.y + nudge.y
          ? displayEnd.y - bWindowBounds.height
          : mousePoint.y + nudge.y,
    }

    tWindow.setPosition(inWindowPosition.x, inWindowPosition.y, false)

    tWindow.show()
  }
}
