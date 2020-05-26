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
import { configStore, urlHistoryStore } from './stores'

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
export let bWindow: BrowserWindow | undefined
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

app.on('activate', () => {
  bWindow?.show()
})

// App doesn't always close on ctrl-c in console, this fixes that
app.on('before-quit', () => {
  app.exit()
})

app.on('open-url', (event, url) => {
  event.preventDefault()
  const id = nanoid()
  urlHistoryStore.set(id, { id, url, timestamp: Date.now() })
  bWindow?.webContents.send(URL_HISTORY_CHANGED, urlHistoryStore.store)
})

/**
 * ------------------
 * Renderer Listeners
 * ------------------
 */

ipcMain.on(APP_LOADED, async () => {
  // Send browsers down to picker
  const installedBrowsers = await getInstalledBrowsers()
  const favBrowserId = configStore.get('fav')
  const favFirst = pipe(partition({ appId: favBrowserId }), flatten)
  const browsers = favFirst(installedBrowsers)
  bWindow?.webContents.send(BROWSERS_SCANNED, browsers)
  bWindow?.webContents.send(URL_HISTORY_CHANGED, urlHistoryStore.store)
})

interface BrowserSelectedEventArgs {
  urlId: string
  browserId: Browser['id']
  isAlt: boolean
}

ipcMain.on(
  BROWSER_SELECTED,
  (_: Event, { urlId, browserId, isAlt }: BrowserSelectedEventArgs) => {
    const urlItem = urlHistoryStore.get(urlId)
    if (urlItem) {
      if (isAlt) {
        execa('open', [urlItem.url, '-b', browserId, '-g'])
      } else {
        execa('open', [urlItem.url, '-b', browserId])
      }
    }
  },
)

ipcMain.on(COPY_TO_CLIPBOARD, (_: Event, url: string) => {
  copyToClipboard(url)
})

/**
 * ------------------
 * Store Listeners
 * ------------------
 */

urlHistoryStore.onDidAnyChange((updatedStore) => {
  bWindow?.webContents.send(URL_HISTORY_CHANGED, updatedStore)
  bWindow?.show()
})
