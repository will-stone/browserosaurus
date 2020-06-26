import { execFile } from 'child_process'
import { app, autoUpdater, BrowserWindow, ipcMain, Tray } from 'electron'
import electronIsDev from 'electron-is-dev'
import path from 'path'

import package_ from '../../package.json'
import { Browser, browsers } from '../config/browsers'
import {
  COPY_TO_CLIPBOARD,
  HIDE_WINDOW,
  MAIN_LOG,
  QUIT,
  RELOAD,
  SELECT_BROWSER,
  SET_AS_DEFAULT_BROWSER,
  START_APP,
  UPDATE_FAV,
  UPDATE_HIDDEN_TILE_IDS,
  UPDATE_HOTKEYS,
  UPDATE_RESTART,
} from '../renderer/sendToMain'
import { calcWindowHeight } from '../utils/calcWindowHeight'
import copyToClipboard from '../utils/copyToClipboard'
import getInstalledBrowsers from '../utils/getInstalledBrowsers'
import { logger } from '../utils/logger'
import createWindow from './createWindow'
import {
  APP_VERSION,
  BROWSERS_SCANNED,
  PROTOCOL_STATUS_RETRIEVED,
  STORE_RETRIEVED,
  UPDATE_DOWNLOADED,
  URL_UPDATED,
} from './events'
import { Hotkeys, store } from './store'

// Attempt to fix this bug: https://github.com/electron/electron/issues/20944
app.commandLine.appendArgument('--enable-features=Metal')

if (store.get('firstRun')) {
  // Prompt to set as default browser
  app.setAsDefaultProtocolClient('http')
}

// Hide from dock and cmd-tab
app.dock.hide()

// Prevents garbage collection
let bWindow: BrowserWindow | undefined
let tray: Tray | undefined
let installedBrowsers: Browser[] = []

app.on('ready', async () => {
  bWindow = await createWindow()

  tray = new Tray(path.join(__dirname, '/static/icon/tray_iconTemplate.png'))
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
    autoUpdater.setFeedURL({
      url: `https://update.electronjs.org/will-stone/browserosaurus/darwin-x64/${app.getVersion()}`,
      headers: {
        'User-Agent': `${package_.name}/${package_.version} (darwin: x64)`,
      },
    })

    autoUpdater.on('before-quit-for-update', () => {
      // All windows must be closed before an update can be applied using "restart".
      bWindow?.destroy()
    })

    autoUpdater.on('update-downloaded', () => {
      bWindow?.webContents.send(UPDATE_DOWNLOADED)
    })

    autoUpdater.on('error', () => {
      logger('AutoUpdater', 'An error has occurred')
    })

    // 1000 * 60 * 60 * 24
    const ONE_DAY_MS = 86400000
    // Check for updates every day. The first check is done on load: in the
    // RENDERER_LOADED listener.
    setInterval(() => {
      autoUpdater.checkForUpdates()
    }, ONE_DAY_MS)
  }
})

// App doesn't always close on ctrl-c in console, this fixes that
app.on('before-quit', () => {
  app.exit()
})

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function sendUrl(url: string) {
  if (bWindow) {
    bWindow.webContents.send(URL_UPDATED, url)
    bWindow.show()
  } else {
    await wait(500)
    sendUrl(url)
  }
}

app.on('open-url', (event, url) => {
  event.preventDefault()
  sendUrl(url)
})

/**
 * ------------------
 * Renderer Listeners
 * ------------------
 */

ipcMain.on(START_APP, async () => {
  installedBrowsers = await getInstalledBrowsers()

  bWindow?.setSize(
    800,
    calcWindowHeight(installedBrowsers, store.store.hiddenTileIds),
  )
  bWindow?.center()

  // Send all info down to renderer
  bWindow?.webContents.send(STORE_RETRIEVED, store.store)
  bWindow?.webContents.send(BROWSERS_SCANNED, installedBrowsers)
  bWindow?.webContents.send(
    APP_VERSION,
    `v${app.getVersion()}${electronIsDev ? ' DEV' : ''}`,
  )

  // Is default browser?
  bWindow?.webContents.send(
    PROTOCOL_STATUS_RETRIEVED,
    app.isDefaultProtocolClient('http'),
  )

  autoUpdater.checkForUpdates()
})

interface BrowserSelectedEventArgs {
  url?: string
  browserId: Browser['id']
  isAlt: boolean
}

ipcMain.on(
  SELECT_BROWSER,
  (_: Event, { url, browserId, isAlt }: BrowserSelectedEventArgs) => {
    // Bail if browser id is missing
    if (!browserId) return

    const browser = browsers.find((b) => b.id === browserId)

    // Bail if browser cannot be found in config (this, in theory, can't happen)
    if (!browser) return

    const urlString = url || ''
    const processedUrlTemplate = browser.urlTemplate
      ? browser.urlTemplate.replace(/\{\{URL\}\}/u, urlString)
      : urlString

    const openArguments: string[] = [
      processedUrlTemplate,
      '-b',
      browserId,
      isAlt ? '--background' : '',
    ].filter(Boolean)

    execFile('open', openArguments)

    bWindow?.hide()
    app.hide()
  },
)

ipcMain.on(COPY_TO_CLIPBOARD, (_: Event, url: string) => {
  if (url) {
    copyToClipboard(url)
    bWindow?.hide()
    app.hide()
  }
})

ipcMain.on(HIDE_WINDOW, () => {
  bWindow?.hide()
  app.hide()
})

ipcMain.on(UPDATE_FAV, (_, favBrowserId) => {
  store.set('fav', favBrowserId)
})

ipcMain.on(UPDATE_HOTKEYS, (_, hotkeys: Hotkeys) => {
  store.set('hotkeys', hotkeys)
})

ipcMain.on(UPDATE_HIDDEN_TILE_IDS, (_, hiddenTileIds: string[]) => {
  bWindow?.setSize(800, calcWindowHeight(installedBrowsers, hiddenTileIds))
  bWindow?.center()
  store.set('hiddenTileIds', hiddenTileIds)
})

ipcMain.on(SET_AS_DEFAULT_BROWSER, () => {
  app.setAsDefaultProtocolClient('http')
})

ipcMain.on(RELOAD, () => {
  bWindow?.reload()
})

ipcMain.on(UPDATE_RESTART, () => {
  autoUpdater.quitAndInstall()
})

ipcMain.on(QUIT, () => {
  app.quit()
})

ipcMain.on(MAIN_LOG, (_, string: string) => {
  logger('Renderer', string)
})
