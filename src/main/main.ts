import { app, BrowserWindow, ipcMain } from 'electron'
import execa from 'execa'
import flatten from 'lodash/fp/flatten'
import partition from 'lodash/fp/partition'
import pipe from 'lodash/fp/pipe'

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
import { selectLastestUrl, store } from './store'

// TODO this will be useful if I need to require plugins dynamically
// eslint-disable-next-line camelcase, no-underscore-dangle
// declare const __non_webpack_require__: (path: string) => { hello: string }

// TODO [electron@>=9] This will be the default in Electron 9, remove once upgraded
app.allowRendererProcessReuse = true

// Attempt to fix this bug: https://github.com/electron/electron/issues/20944
app.commandLine.appendArgument('--enable-features=Metal')

// Prompt to set as default browser
app.setAsDefaultProtocolClient('http')

export let bWindow: BrowserWindow | undefined

app.on('ready', async () => {
  bWindow = await createWindow()
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
  const updatedUrlHistory = [
    { url, timestamp: Date.now() },
    ...store.get('urlHistory'),
  ]
  store.set('urlHistory', updatedUrlHistory)
})

/**
 * ------------------
 * Renderer Listeners
 * ------------------
 */

/**
 * React App component has mounted
 */
ipcMain.on(APP_LOADED, async () => {
  // Send browsers down to picker
  const installedBrowsers = await getInstalledBrowsers()
  const favBrowserId = store.get('fav')
  const favFirst = pipe(partition({ appId: favBrowserId }), flatten)
  const browsers = favFirst(installedBrowsers)
  bWindow?.webContents.send(BROWSERS_SCANNED, browsers)
  bWindow?.webContents.send(URL_HISTORY_CHANGED, store.get('urlHistory'))
})

ipcMain.on(
  BROWSER_SELECTED,
  (_: Event, { id, isAlt }: { id: Browser['id']; isAlt: boolean }) => {
    const latestUrl = selectLastestUrl()
    if (latestUrl) {
      if (isAlt) {
        execa('open', [latestUrl.url, '-b', id, '-g'])
      } else {
        execa('open', [latestUrl.url, '-b', id])
      }
    }
  },
)

ipcMain.on(COPY_TO_CLIPBOARD, (_: Event, url: string) => {
  copyToClipboard(url)
})
