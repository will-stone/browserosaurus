import { app, BrowserWindow, ipcMain, Tray } from 'electron'
import execa from 'execa'
import path from 'path'

import { Browser, browsers } from '../config/browsers'
import {
  BROWSER_SELECTED,
  COPY_TO_CLIPBOARD,
  ESCAPE_PRESSED,
  FAVOURITE_SELECTED,
  HOTKEYS_UPDATED,
  LOGGER,
  QUIT,
  RELOAD,
  RENDERER_LOADED,
  SET_AS_DEFAULT_BROWSER,
} from '../renderer/events'
import copyToClipboard from '../utils/copyToClipboard'
import getInstalledBrowsers from '../utils/getInstalledBrowsers'
import { checkForUpdate } from '../utils/isUpdateAvailable'
import { logger } from '../utils/logger'
import createWindow from './createWindow'
import {
  APP_VERSION,
  BROWSERS_SCANNED,
  FAVOURITE_CHANGED,
  HOTKEYS_RETRIEVED,
  PROTOCOL_STATUS,
  UPDATE_STATUS,
  URL_UPDATED,
} from './events'
import { Hotkeys, store } from './store'

// TODO [electron@>=9] This will be the default in Electron 9, remove once upgraded
app.allowRendererProcessReuse = true

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

// 1000 * 60 * 60 * 24
const ONE_DAY_MS = 86400000

async function updateChecker() {
  const lastUpdateCheck = store.get('lastUpdateCheck')
  const now = Date.now()

  if (!lastUpdateCheck || lastUpdateCheck + ONE_DAY_MS < now) {
    logger('Main', 'Checking for update')
    const isUpdateAvailable = await checkForUpdate(app.getVersion())
    bWindow?.webContents.send(UPDATE_STATUS, isUpdateAvailable)
    store.set('lastUpdateCheck', now)
  }
}

app.on('open-url', (event, url) => {
  event.preventDefault()
  sendUrl(url)
  updateChecker()
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
  bWindow?.webContents.send(APP_VERSION, app.getVersion())

  // Is default browser?
  bWindow?.webContents.send(
    PROTOCOL_STATUS,
    app.isDefaultProtocolClient('http'),
  )

  updateChecker()
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
      processedUrlTemplate,
      '-b',
      browserId,
      isAlt ? '--background' : '',
    ].filter(Boolean)

    execa('open', openArguments)

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

ipcMain.on(FAVOURITE_SELECTED, (_, favBrowserId) => {
  store.set('fav', favBrowserId)
  // TODO should this be here? Maybe deal with this the same as hotkeys
  // by only sending down value on start and letting renderer keep track of its state?
  bWindow?.webContents.send(FAVOURITE_CHANGED, favBrowserId)
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

ipcMain.on(QUIT, () => {
  app.quit()
})

ipcMain.on(LOGGER, (_, string: string) => {
  logger('Renderer', string)
})
