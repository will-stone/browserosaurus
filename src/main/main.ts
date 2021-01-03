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
  appStarted,
  changedHotkey,
  clickedCarrotButton,
  clickedCloseMenuButton,
  clickedCopyButton,
  clickedEyeButton,
  clickedFavButton,
  clickedQuitButton,
  clickedReloadButton,
  clickedSetAsDefaultBrowserButton,
  clickedSettingsButton,
  clickedTile,
  clickedUpdateRestartButton,
  pressedAppKey,
  pressedCopyKey,
  pressedEscapeKey,
} from '../renderer/store/actions'
import type { ThemeState } from '../renderer/store/reducers'
import { alterHotkeys } from '../utils/alterHotkeys'
import copyToClipboard from '../utils/copyToClipboard'
import { filterAppsByInstalled } from '../utils/filterAppsByInstalled'
import { logger } from '../utils/logger'
import {
  APP_VERSION,
  INSTALLED_APPS_FOUND,
  PROTOCOL_STATUS_RETRIEVED,
  STORE_RETRIEVED,
  THEME,
  UPDATE_AVAILABLE,
  UPDATE_DOWNLOADED,
  URL_UPDATED,
} from './events'
import { store } from './store'

function getTheme(): ThemeState {
  const theme = {
    // Is dark mode?
    isDarkMode: electron.nativeTheme.shouldUseDarkColors,

    // Accent
    accent: `#${electron.systemPreferences.getAccentColor()}`,
  }
  return theme
}

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Attempt to fix this bug: https://github.com/electron/electron/issues/20944
electron.app.commandLine.appendArgument('--enable-features=Metal')

if (store.get('firstRun')) {
  // Prompt to set as default browser
  electron.app.setAsDefaultProtocolClient('http')
}

// Prevents garbage collection
let bWindow: electron.BrowserWindow | undefined
let tray: electron.Tray | undefined
let isEditMode = false

// TODO due to this issue: https://github.com/electron/electron/issues/18699
// this does not work as advertised. It will detect the change but getColor()
// doesn't fetch updated values. Hopefully this will work in time.
electron.nativeTheme.on('updated', () => {
  bWindow?.webContents.send(THEME, getTheme())
})

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

electron.app.on('ready', async () => {
  const bounds = store.get('bounds')

  bWindow = new electron.BrowserWindow({
    frame: true,
    icon: path.join(__dirname, '/static/icon/icon.png'),
    title: 'Browserosaurus',
    webPreferences: {
      additionalArguments: [],
      nodeIntegration: true,
      contextIsolation: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      enableRemoteModule: false,
    },
    center: true,
    height: bounds?.height || 212,
    minHeight: 212,
    width: bounds?.width || 458,
    minWidth: 458,
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
    // TODO required until this bug is fixed: https://github.com/electron/electron/issues/27080
    titleBarStyle: 'customButtonsOnHover',
    alwaysOnTop: true,
  })

  await bWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // TODO [electron@>=12] visibleOnFullScreen not currently working on Electron 11, need to wait for 12:
  // https://github.com/electron/electron/issues/10078#issuecomment-747901576
  bWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

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

  bWindow.on('blur', () => {
    bWindow?.hide()
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
    isEditMode = false
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

electron.ipcMain.on('FROM_RENDERER', async (_, action: AnyAction) => {
  // App started
  if (appStarted.match(action)) {
    // Resets edit-mode if renderer was restarted whilst in edit-mode
    isEditMode = false

    const installedApps = await filterAppsByInstalled(apps)

    // Send all info down to renderer
    bWindow?.webContents.send(THEME, getTheme())
    bWindow?.webContents.send(STORE_RETRIEVED, store.store)
    bWindow?.webContents.send(INSTALLED_APPS_FOUND, installedApps)
    bWindow?.webContents.send(
      APP_VERSION,
      `${electron.app.getVersion()}${electronIsDev ? ' DEV' : ''}`,
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
    bWindow?.hide()
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

  // Update hotkeys
  else if (changedHotkey.match(action)) {
    const updatedHotkeys = alterHotkeys(
      store.get('hotkeys'),
      action.payload.appId,
      action.payload.value,
    )
    store.set('hotkeys', updatedHotkeys)
  }

  // Open app
  else if (pressedAppKey.match(action) || clickedTile.match(action)) {
    const { appId, url, isAlt, isShift } = action.payload

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
      // In order for private/incognito mode to work the URL needs to be passed
      // in last, _after_ the respective app.privateArg flag
      processedUrlTemplate,
    ].flat()

    execFile('open', openArguments)
  }

  // Go into edit mode
  else if (clickedSettingsButton.match(action)) {
    isEditMode = true
  }

  // Click close edit mode
  else if (clickedCloseMenuButton.match(action)) {
    isEditMode = false
  }

  // Click carrot
  else if (clickedCarrotButton.match(action)) {
    isEditMode = false
  }

  // Escape key
  else if (pressedEscapeKey.match(action)) {
    if (isEditMode) {
      isEditMode = false
    } else {
      bWindow?.hide()
    }
  }
})
