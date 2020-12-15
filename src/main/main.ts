import { AnyAction } from '@reduxjs/toolkit'
import { execFile } from 'child_process'
import electron from 'electron'
import electronIsDev from 'electron-is-dev'
import xor from 'lodash/xor'
import path from 'path'
import sleep from 'tings/sleep'

import package_ from '../../package.json'
import { apps } from '../config/apps'
import {
  APP_SELECTED,
  CHANGE_THEME,
  HIDE_WINDOW,
  HOTKEYS_UPDATED,
  OpenAppArguments,
} from '../renderer/sendToMain'
import {
  appStarted,
  clickedCopyButton,
  clickedEyeButton,
  clickedFavButton,
  clickedQuitButton,
  clickedReloadButton,
  clickedSetAsDefaultBrowserButton,
  clickedSettingsButton,
  clickedUpdateRestartButton,
  pressedCopyKey,
} from '../renderer/store/actions'
import copyToClipboard from '../utils/copyToClipboard'
import { filterAppsByInstalled } from '../utils/filterAppsByInstalled'
import { logger } from '../utils/logger'
import {
  APP_VERSION,
  INSTALLED_APPS_FOUND,
  PROTOCOL_STATUS_RETRIEVED,
  STORE_RETRIEVED,
  UPDATE_AVAILABLE,
  UPDATE_DOWNLOADED,
  URL_UPDATED,
} from './events'
import { Hotkeys, Store, store } from './store'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
declare const SETTINGS_WINDOW_WEBPACK_ENTRY: string
declare const SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Attempt to fix this bug: https://github.com/electron/electron/issues/20944
electron.app.commandLine.appendArgument('--enable-features=Metal')

if (store.get('firstRun')) {
  // Prompt to set as default browser
  electron.app.setAsDefaultProtocolClient('http')
}

// Prevents garbage collection
let bWindow: electron.BrowserWindow | undefined
let sWindow: electron.BrowserWindow | undefined
let tray: electron.Tray | undefined

function showBWindow() {
  if (bWindow) {
    const displayBounds = electron.screen.getDisplayNearestPoint(
      electron.screen.getCursorScreenPoint(),
    ).bounds

    const displayEnd = {
      x: displayBounds.x + displayBounds.width,
      y: displayBounds.y + displayBounds.height,
    }

    const mousePoint = electron.screen.getCursorScreenPoint()

    const bWindowBounds = bWindow.getBounds()

    const bWindowEdges = {
      right: mousePoint.x + bWindowBounds.width,
      bottom: mousePoint.y + bWindowBounds.height,
    }

    const inWindowPosition = {
      x:
        bWindowEdges.right > displayEnd.x
          ? displayEnd.x - bWindowBounds.width
          : mousePoint.x,
      y:
        bWindowEdges.bottom > displayEnd.y
          ? displayEnd.y - bWindowBounds.height
          : mousePoint.y,
    }

    bWindow.setPosition(inWindowPosition.x, inWindowPosition.y, false)

    bWindow.show()
  }
}

electron.app.on('ready', async () => {
  const bounds = store.get('bounds')

  bWindow = new electron.BrowserWindow({
    frame: false,
    icon: path.join(__dirname, '/static/icon/icon.png'),
    title: 'Browserosaurus',
    webPreferences: {
      additionalArguments: [],
      nodeIntegration: true,
      contextIsolation: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      enableRemoteModule: false,
    },
    x: bounds?.x,
    y: bounds?.y,
    height: bounds?.height || 168,
    minHeight: 168,
    width: bounds?.width || 500,
    minWidth: 500,
    show: false,
    minimizable: false,
    maximizable: false,
    fullscreen: false,
    fullscreenable: false,
    movable: true,
    resizable: true,
    transparent: false,
    hasShadow: true,
    backgroundColor: '#1A202C',
  })

  await bWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  bWindow.on('hide', () => {
    electron.app.hide()
  })

  bWindow.on('close', (event_) => {
    event_.preventDefault()
    bWindow?.hide()
  })

  bWindow.on('show', () => {
    // There isn't a listener for default protocol client, therefore the check
    // is made each time the app is brought into focus.
    bWindow?.webContents.send(
      PROTOCOL_STATUS_RETRIEVED,
      electron.app.isDefaultProtocolClient('http'),
    )
  })

  bWindow.on('resize', () => {
    store.set('bounds', bWindow?.getBounds())
  })

  bWindow.on('moved', () => {
    store.set('bounds', bWindow?.getBounds())
  })

  bWindow.on('blur', () => {
    // if (!electronIsDev) {
    bWindow?.hide()
    // }
  })

  /**
   * Menubar icon
   */
  tray = new electron.Tray(
    path.join(__dirname, '/static/icon/tray_iconTemplate.png'),
  )
  tray.setPressedImage(
    path.join(__dirname, '/static/icon/tray_iconHighlight.png'),
  )
  tray.setToolTip('Browserosaurus')
  tray.addListener('click', () => showBWindow())

  store.set('firstRun', false)

  // Auto update on production
  if (!electronIsDev) {
    electron.autoUpdater.setFeedURL({
      url: `https://update.electronjs.org/will-stone/browserosaurus/darwin-${
        process.arch
      }/${electron.app.getVersion()}`,
      headers: {
        'User-Agent': `${package_.name}/${package_.version} (darwin: ${process.arch})`,
      },
    })

    electron.autoUpdater.on('before-quit-for-update', () => {
      // All windows must be closed before an update can be applied using "restart".
      bWindow?.destroy()
    })

    electron.autoUpdater.on('update-available', () => {
      bWindow?.webContents.send(UPDATE_AVAILABLE)
    })

    electron.autoUpdater.on('update-downloaded', () => {
      bWindow?.webContents.send(UPDATE_DOWNLOADED)
    })

    electron.autoUpdater.on('error', () => {
      logger('AutoUpdater', 'An error has occurred')
    })

    // 1000 * 60 * 60 * 24
    const ONE_DAY_MS = 86_400_000
    // Check for updates every day. The first check is done on load: in the
    // RENDERER_LOADED listener.
    setInterval(() => {
      electron.autoUpdater.checkForUpdates()
    }, ONE_DAY_MS)
  }

  // Hide from dock and cmd-tab
  electron.app.dock.hide()
})

// App doesn't always close on ctrl-c in console, this fixes that
electron.app.on('before-quit', () => {
  electron.app.exit()
})

async function sendUrl(url: string) {
  if (bWindow) {
    bWindow.webContents.send(URL_UPDATED, url)
    showBWindow()
  } else {
    await sleep(500)
    sendUrl(url)
  }
}

electron.app.on('open-url', (event, url) => {
  event.preventDefault()
  sendUrl(url)
})

/**
 * ------------------
 * Renderer Listeners
 * ------------------
 */

electron.ipcMain.on(
  APP_SELECTED,
  (_: Event, { url, appId, isAlt, isShift }: OpenAppArguments) => {
    // Bail if app's bundle id is missing
    if (!appId) return

    const app = apps.find((b) => b.id === appId)

    // Bail if app cannot be found in config (this, in theory, can't happen)
    if (!app) return

    const urlString = url || ''
    const processedUrlTemplate = app.urlTemplate
      ? app.urlTemplate.replace(/\{\{URL\}\}/u, urlString)
      : urlString

    const openArguments: string[] = [
      '-b',
      appId,
      isAlt ? '--background' : [],
      isShift && app.privateArg ? ['--new', '--args', app.privateArg] : [],
      // In order for private/incognito mode to work the URL needs to be passed at last, _after_ the respective app.privateArg flag
      processedUrlTemplate,
    ].flat()

    execFile('open', openArguments)
  },
)

electron.ipcMain.on(HIDE_WINDOW, () => {
  bWindow?.hide()
})

electron.ipcMain.on(HOTKEYS_UPDATED, (_, hotkeys: Hotkeys) => {
  store.set('hotkeys', hotkeys)
})

electron.ipcMain.on(CHANGE_THEME, (_, theme: Store['theme']) => {
  store.set('theme', theme)
})

electron.ipcMain.on('FROM_RENDERER', async (_, action: AnyAction) => {
  // App started
  if (appStarted.match(action)) {
    const installedApps = await filterAppsByInstalled(apps)

    // Send all info down to renderer
    bWindow?.webContents.send(STORE_RETRIEVED, store.store)
    bWindow?.webContents.send(INSTALLED_APPS_FOUND, installedApps)
    bWindow?.webContents.send(
      APP_VERSION,
      `v${electron.app.getVersion()}${electronIsDev ? ' DEV' : ''}`,
    )

    // Is default browser?
    bWindow?.webContents.send(
      PROTOCOL_STATUS_RETRIEVED,
      electron.app.isDefaultProtocolClient('http'),
    )

    electron.autoUpdater.checkForUpdates()
  }
  // Copy to clipboard
  else if (clickedCopyButton.match(action) || pressedCopyKey.match(action)) {
    copyToClipboard(action.payload)
  }

  // Quit
  else if (clickedQuitButton.match(action)) {
    electron.app.quit()
  }

  // Reload
  else if (clickedReloadButton.match(action)) {
    bWindow?.reload()
  }

  // Set as default browser
  else if (clickedSetAsDefaultBrowserButton.match(action)) {
    electron.app.setAsDefaultProtocolClient('http')
  }

  // Update and restart
  else if (clickedUpdateRestartButton.match(action)) {
    electron.autoUpdater.quitAndInstall()
  }

  // Open settings
  else if (clickedSettingsButton.match(action)) {
    sWindow = new electron.BrowserWindow({
      parent: bWindow,
      modal: true,
      show: false,
      frame: true,
      titleBarStyle: 'hiddenInset',
      icon: path.join(__dirname, '/static/icon/icon.png'),
      title: 'Settings',
      webPreferences: {
        additionalArguments: [],
        nodeIntegration: true,
        contextIsolation: false,
        preload: SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY,
        enableRemoteModule: false,
      },
      // center: true,
      height: 500,
      width: 500,
      minimizable: false,
      maximizable: false,
      fullscreen: false,
      fullscreenable: false,
      movable: true,
      resizable: false,
      transparent: false,
      hasShadow: true,
      backgroundColor: '#1A202C',
    })

    await sWindow.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY)

    sWindow.once('ready-to-show', () => {
      sWindow?.show()
    })
  }

  // Change fav
  else if (clickedFavButton.match(action)) {
    store.set('fav', action.payload)
  }

  // Update hidden tiles
  else if (clickedEyeButton.match(action)) {
    store.set(
      'hiddenTileIds',
      xor(store.get('hiddenTileIds'), [action.payload]),
    )
  }
})
