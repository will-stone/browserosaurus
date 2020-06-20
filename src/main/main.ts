import { exec } from 'child_process'
import { app, autoUpdater, BrowserWindow, ipcMain, Tray } from 'electron'
import electronIsDev from 'electron-is-dev'
import path from 'path'

import package_ from '../../package.json'
import { Browser, browsers } from '../config/browsers'
import {
  BROWSER_SELECTED,
  COPY_TO_CLIPBOARD,
  ESCAPE_PRESSED,
  FAVOURITE_UPDATED,
  HOTKEYS_UPDATED,
  LOGGER,
  QUIT,
  RELOAD,
  RENDERER_LOADED,
  SET_AS_DEFAULT_BROWSER,
  UPDATE_RESTART,
} from '../renderer/events'
import copyToClipboard from '../utils/copyToClipboard'
import getInstalledBrowsers from '../utils/getInstalledBrowsers'
import { logger } from '../utils/logger'
import createWindow from './createWindow'
import {
  APP_VERSION,
  BROWSERS_SCANNED,
  FAVOURITE_CHANGED,
  HOTKEYS_RETRIEVED,
  PROTOCOL_STATUS,
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
    const feedURL = `https://update.electronjs.org/will-stone/browserosaurus/darwin-x64/${app.getVersion()}`

    autoUpdater.setFeedURL({
      url: feedURL,
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

ipcMain.on(RENDERER_LOADED, async () => {
  const installedBrowsers = await getInstalledBrowsers()

  // Position window
  const numberOfExtraBrowserRows = Math.ceil(installedBrowsers.length / 5) - 1
  bWindow?.setSize(800, 249 + numberOfExtraBrowserRows * 112)
  bWindow?.center()

  // Send all info down to renderer
  bWindow?.webContents.send(HOTKEYS_RETRIEVED, store.get('hotkeys'))
  bWindow?.webContents.send(FAVOURITE_CHANGED, store.get('fav'))
  bWindow?.webContents.send(BROWSERS_SCANNED, installedBrowsers)
  bWindow?.webContents.send(
    APP_VERSION,
    `v${app.getVersion()}${electronIsDev ? ' DEV' : ''}`,
  )

  // Is default browser?
  bWindow?.webContents.send(
    PROTOCOL_STATUS,
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
  BROWSER_SELECTED,
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
      'open',
      processedUrlTemplate,
      '-b',
      browserId,
      isAlt ? '--background' : '',
    ].filter(Boolean)

    exec(openArguments.join(' '))

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

ipcMain.on(ESCAPE_PRESSED, () => {
  bWindow?.hide()
  app.hide()
})

ipcMain.on(FAVOURITE_UPDATED, (_, favBrowserId) => {
  store.set('fav', favBrowserId)
})

ipcMain.on(HOTKEYS_UPDATED, (_, hotkeys: Hotkeys) => {
  store.set('hotkeys', hotkeys)
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

ipcMain.on(LOGGER, (_, string: string) => {
  logger('Renderer', string)
})
