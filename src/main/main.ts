import { execFile } from 'child_process'
import electron from 'electron'
import electronIsDev from 'electron-is-dev'
import path from 'path'
import sleep from 'tings/sleep'

import package_ from '../../package.json'
import { apps } from '../config/apps'
import { App } from '../config/types'
import {
  APP_SELECTED,
  CHANGE_THEME,
  COPY_TO_CLIPBOARD,
  FAV_SELECTED,
  HIDE_WINDOW,
  HOTKEYS_UPDATED,
  MAIN_LOG,
  OpenAppArguments,
  QUIT,
  RELOAD,
  RENDERER_STARTED,
  SET_AS_DEFAULT_BROWSER,
  UPDATE_HIDDEN_TILE_IDS,
  UPDATE_RESTART,
} from '../renderer/sendToMain'
import copyToClipboard from '../utils/copyToClipboard'
import { filterAppsByInstalled } from '../utils/filterAppsByInstalled'
import { logger } from '../utils/logger'
import createWindow from './createWindow'
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

// Attempt to fix this bug: https://github.com/electron/electron/issues/20944
electron.app.commandLine.appendArgument('--enable-features=Metal')

if (store.get('firstRun')) {
  // Prompt to set as default browser
  electron.app.setAsDefaultProtocolClient('http')
}

// Prevents garbage collection
let bWindow: electron.BrowserWindow | undefined
let tray: electron.Tray | undefined
let installedApps: App[] = []

electron.app.on('ready', async () => {
  bWindow = await createWindow()

  tray = new electron.Tray(
    path.join(__dirname, '/static/icon/tray_iconTemplate.png'),
  )
  tray.setPressedImage(
    path.join(__dirname, '/static/icon/tray_iconHighlight.png'),
  )
  tray.setToolTip('Browserosaurus')
  tray.addListener('click', () => {
    bWindow?.show()
  })

  store.set('firstRun', false)

  // Auto update on production
  if (!electronIsDev) {
    electron.autoUpdater.setFeedURL({
      url: `https://update.electronjs.org/will-stone/browserosaurus/darwin-x64/${electron.app.getVersion()}`,
      headers: {
        'User-Agent': `${package_.name}/${package_.version} (darwin: x64)`,
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
    bWindow.show()
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

electron.ipcMain.on(RENDERER_STARTED, async () => {
  installedApps = await filterAppsByInstalled(apps)

  bWindow?.center()

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
})

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

electron.ipcMain.on(COPY_TO_CLIPBOARD, (_: Event, url: string) => {
  copyToClipboard(url)
})

electron.ipcMain.on(HIDE_WINDOW, () => {
  bWindow?.hide()
})

electron.ipcMain.on(FAV_SELECTED, (_, favAppId) => {
  store.set('fav', favAppId)
})

electron.ipcMain.on(HOTKEYS_UPDATED, (_, hotkeys: Hotkeys) => {
  store.set('hotkeys', hotkeys)
})

electron.ipcMain.on(CHANGE_THEME, (_, theme: Store['theme']) => {
  store.set('theme', theme)
})

electron.ipcMain.on(UPDATE_HIDDEN_TILE_IDS, (_, hiddenTileIds: string[]) => {
  store.set('hiddenTileIds', hiddenTileIds)
})

electron.ipcMain.on(SET_AS_DEFAULT_BROWSER, () => {
  electron.app.setAsDefaultProtocolClient('http')
})

electron.ipcMain.on(RELOAD, () => {
  bWindow?.reload()
})

electron.ipcMain.on(UPDATE_RESTART, () => {
  electron.autoUpdater.quitAndInstall()
})

electron.ipcMain.on(QUIT, () => {
  electron.app.quit()
})

electron.ipcMain.on(MAIN_LOG, (_, string: string) => {
  logger('Renderer', string)
})
