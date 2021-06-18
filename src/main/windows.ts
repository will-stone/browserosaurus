import { BrowserWindow } from 'electron'
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
