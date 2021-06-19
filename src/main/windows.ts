import { BrowserWindow, screen } from 'electron'
import path from 'path'

import { permaStore } from './perma-store'

// Prevents garbage collection
export let bWindow: BrowserWindow | undefined
export let pWindow: BrowserWindow | undefined

export function createWindows(): void {
  pWindow = new BrowserWindow({
    // Only show on demand
    show: false,

    // Chrome
    height: 600,
    width: 800,
    resizable: false,
    center: true,
    minimizable: false,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'content',

    // Meta
    icon: path.join(__dirname, '/static/icon/icon.png'),
    title: 'Preferences',

    webPreferences: {
      // TODO only until this is fixed: https://github.com/will-stone/browserosaurus/issues/408
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  const bounds = permaStore.get('bounds')

  bWindow = new BrowserWindow({
    frame: true,
    icon: path.join(__dirname, '/static/icon/icon.png'),
    title: 'Browserosaurus',
    webPreferences: {
      // TODO only until this is fixed: https://github.com/will-stone/browserosaurus/issues/408
      nodeIntegration: true,
      contextIsolation: false,
    },
    center: true,
    height: bounds?.height || 204,
    minHeight: 204,
    width: bounds?.width || 424,
    minWidth: 424,
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
}

export function showBWindow(): void {
  if (bWindow) {
    const displayBounds = screen.getDisplayNearestPoint(
      screen.getCursorScreenPoint(),
    ).bounds

    const displayEnd = {
      x: displayBounds.x + displayBounds.width,
      y: displayBounds.y + displayBounds.height,
    }

    const mousePoint = screen.getCursorScreenPoint()

    const bWindowBounds = bWindow.getBounds()

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

    bWindow.setPosition(inWindowPosition.x, inWindowPosition.y, false)

    bWindow.show()
  }
}
