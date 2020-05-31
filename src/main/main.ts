import { app, BrowserWindow, ipcMain, Tray } from 'electron'
import electronIsDev from 'electron-is-dev'
import execa from 'execa'
import { nanoid } from 'nanoid/non-secure'
import path from 'path'

import { Browser } from '../config/browsers'
import {
  BROWSER_SELECTED,
  COPY_TO_CLIPBOARD,
  ESCAPE_PRESSED,
  FAVOURITE_SELECTED,
  LOGGER,
  QUIT,
  RENDERER_LOADED,
} from '../renderer/events'
import copyToClipboard from '../utils/copyToClipboard'
import getInstalledBrowsers from '../utils/getInstalledBrowsers'
import createWindow from './createWindow'
import {
  APP_VERSION,
  BROWSERS_SCANNED,
  FAVOURITE_CHANGED,
  URL_HISTORY_CHANGED,
} from './events'
import { store, UrlHistoryItem } from './store'

// TODO [electron@>=9] This will be the default in Electron 9, remove once upgraded
app.allowRendererProcessReuse = true

// Attempt to fix this bug: https://github.com/electron/electron/issues/20944
app.commandLine.appendArgument('--enable-features=Metal')

// Prompt to set as default browser
app.setAsDefaultProtocolClient('http')

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
})

// App doesn't always close on ctrl-c in console, this fixes that
app.on('before-quit', () => {
  app.exit()
})

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function sendUrlHistory(urlHistory: UrlHistoryItem[]) {
  if (bWindow) {
    bWindow.webContents.send(URL_HISTORY_CHANGED, urlHistory)
    bWindow.show()
  } else {
    await wait(500)
    sendUrlHistory(urlHistory)
  }
}

app.on('open-url', (event, url) => {
  event.preventDefault()
  const id = nanoid()
  const urlHistory = store.get('urlHistory')
  const updatedUrlHistory = [
    // Only keep a small history
    ...urlHistory.slice(-10),
    { id, url, timestamp: Date.now() },
  ]
  sendUrlHistory(updatedUrlHistory)
  store.set('urlHistory', updatedUrlHistory)
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
  bWindow?.webContents.send(FAVOURITE_CHANGED, store.get('fav'))
  bWindow?.webContents.send(BROWSERS_SCANNED, installedBrowsers)
  bWindow?.webContents.send(URL_HISTORY_CHANGED, store.get('urlHistory'))
  bWindow?.webContents.send(APP_VERSION, app.getVersion())
})

interface BrowserSelectedEventArgs {
  urlId: string
  browserId: Browser['id']
  isAlt: boolean
}

ipcMain.on(
  BROWSER_SELECTED,
  (_: Event, { urlId, browserId, isAlt }: BrowserSelectedEventArgs) => {
    // Bail if browser id is missing
    if (!browserId) return

    const urlItem = store.get('urlHistory').find((u) => u.id === urlId)

    const openArguments: string[] = [
      urlItem?.url || '',
      '-b',
      browserId,
      isAlt ? '-g' : '',
    ].filter(Boolean)

    execa('open', openArguments)

    bWindow?.hide()
    app.hide()
  },
)

ipcMain.on(COPY_TO_CLIPBOARD, (_: Event, urlId: string) => {
  const urlItem = store.get('urlHistory').find((u) => u.id === urlId)
  if (urlItem) {
    copyToClipboard(urlItem.url)
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
  bWindow?.webContents.send(FAVOURITE_CHANGED, favBrowserId)
})

ipcMain.on(QUIT, () => {
  app.quit()
})

const blue = (array: TemplateStringsArray) => `\u001B[34m${array[0]}\u001B[0m`
const dim = (array: TemplateStringsArray) => `\u001B[2m${array[0]}\u001B[0m`

ipcMain.on(LOGGER, (_, string: string) => {
  if (electronIsDev) {
    // eslint-disable-next-line no-console
    console.log(`${blue`Renderer`} ${dim`›`}`, string)
  }
})
