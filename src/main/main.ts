import { app, BrowserWindow, ipcMain, Tray } from 'electron'
import execa from 'execa'
import flatten from 'lodash/fp/flatten'
import partition from 'lodash/fp/partition'
import pipe from 'lodash/fp/pipe'
import { nanoid } from 'nanoid'
import path from 'path'

import { Browser } from '../config/browsers'
import {
  APP_LOADED,
  BROWSER_SELECTED,
  COPY_TO_CLIPBOARD,
} from '../renderer/events'
import copyToClipboard from '../utils/copyToClipboard'
import getInstalledBrowsers from '../utils/getInstalledBrowsers'
import createWindow from './createWindow'
import { BROWSERS_SCANNED, URL_HISTORY_CHANGED } from './events'
import { store } from './store'

// TODO this will be useful if I need to require plugins dynamically
// eslint-disable-next-line camelcase, no-underscore-dangle
// declare const __non_webpack_require__: (path: string) => { hello: string }

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

app.on('open-url', (event, url) => {
  event.preventDefault()
  bWindow?.show()
  const id = nanoid()
  const urlHistory = store.get('urlHistory')
  const updatedUrlHistory = [
    // Only keep a small history
    ...urlHistory.slice(-10),
    { id, url, timestamp: Date.now() },
  ]
  store.set('urlHistory', updatedUrlHistory)
})

/**
 * ------------------
 * Renderer Listeners
 * ------------------
 */

ipcMain.on(APP_LOADED, async () => {
  // Send browsers down to picker
  const installedBrowsers = await getInstalledBrowsers()
  const favBrowserId = store.get('fav')
  const favFirst = pipe(partition({ id: favBrowserId }), flatten)
  const browsers = favFirst(installedBrowsers)
  const numberOfExtraBrowserRows = Math.ceil(browsers.length / 5) - 1
  bWindow?.setSize(800, 249 + numberOfExtraBrowserRows * 112)
  bWindow?.center()
  bWindow?.webContents.send(BROWSERS_SCANNED, browsers)
  bWindow?.webContents.send(URL_HISTORY_CHANGED, store.get('urlHistory'))
})

interface BrowserSelectedEventArgs {
  urlId: string
  browserId: Browser['id']
  isAlt: boolean
}

ipcMain.on(
  BROWSER_SELECTED,
  (_: Event, { urlId, browserId, isAlt }: BrowserSelectedEventArgs) => {
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

/**
 * ------------------
 * Store Listeners
 * ------------------
 */

store.onDidChange('urlHistory', (updatedValue) => {
  bWindow?.webContents.send(URL_HISTORY_CHANGED, updatedValue)
})
