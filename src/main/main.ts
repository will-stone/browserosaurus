import electron from 'electron'
import Store from 'electron-store'
import execa from 'execa'
import flatten from 'lodash/fp/flatten'
import partition from 'lodash/fp/partition'
import pipe from 'lodash/fp/pipe'

import { Browser } from '../config/browsers'
import {
  APP_LOADED,
  BROWSER_RUN,
  BROWSERS_SET,
  COPY_TO_CLIPBOARD,
  URL_RECEIVED,
} from '../config/events'
import copyToClipboard from '../utils/copyToClipboard'
import getInstalledBrowsers from '../utils/getInstalledBrowsers'
import createWindow from './createWindow'

// eslint-disable-next-line camelcase, no-underscore-dangle
declare const __non_webpack_require__: (path: string) => { hello: string }

// TODO This will be the default in Electron 9, remove once upgraded
electron.app.allowRendererProcessReuse = true

// Attempt to fix this bug: https://github.com/electron/electron/issues/20944
electron.app.commandLine.appendArgument('--enable-features=Metal')

// Prompt to set as default browser
electron.app.setAsDefaultProtocolClient('http')

interface B {
  store: Store<{ fav: string }>
  url?: string
  window?: electron.BrowserWindow
}

const b: B = {
  store: new Store({ fav: { type: 'string' } }),
  url: undefined,
  window: undefined,
}

const urlReceived = (url: string, win: electron.BrowserWindow) => {
  win.webContents.send(URL_RECEIVED, url)
  win.show()
}

// Send browsers down to picker
electron.ipcMain.on(APP_LOADED, async () => {
  const installedBrowsers = await getInstalledBrowsers()
  const favBrowserId = b.store.get('fav') || 'com.apple.Safari'
  const favFirst = pipe(partition({ appId: favBrowserId }), flatten)
  const browsers = favFirst(installedBrowsers)
  b.window?.webContents.send(BROWSERS_SET, browsers)
  b.window?.webContents.send(URL_RECEIVED, b.url)
})

electron.ipcMain.on(
  BROWSER_RUN,
  (_: Event, { id, isAlt }: { id: Browser['id']; isAlt: boolean }) => {
    if (b.url) {
      if (isAlt) {
        execa('open', [b.url, '-b', id, '-g'])
      } else {
        execa('open', [b.url, '-b', id])
      }
    }
  },
)

electron.ipcMain.on(COPY_TO_CLIPBOARD, (_: Event, url: string) => {
  copyToClipboard(url)
})

electron.app.on('ready', async () => {
  b.window = await createWindow()

  if (b.url) {
    // if Browserosaurus was opened with a link, this will now be sent on to the picker window.
    urlReceived(b.url, b.window)
  }

  // Auto update on production
  // if (!isDev) {
  //   const feedURL = `https://update.electronjs.org/will-stone/browserosaurus/darwin-x64/${app.getVersion()}`

  //   autoUpdater.setFeedURL({
  //     url: feedURL,
  //     headers: {
  //       'User-Agent': `${pkg.name}/${pkg.version} (darwin: x64)`,
  //     },
  //   })

  //   autoUpdater.on('update-downloaded', () => {
  //     return null
  //   })

  //   autoUpdater.on('before-quit-for-update', () => {
  //     // All windows must be closed before an update can be applied using "restart".
  //     pickerWindow.destroy()
  //   })

  //   autoUpdater.on('error', (err) => {
  //     // eslint-disable-next-line no-console
  //     console.log('updater error', err)
  //   })

  //   // check for updates right away and keep checking later
  //   const TEN_MINS = 600000
  //   autoUpdater.checkForUpdates()
  //   setInterval(() => {
  //     autoUpdater.checkForUpdates()
  //   }, TEN_MINS)
  // }
})

electron.app.on('activate', () => {
  b.window?.show()
})

// App doesn't always close on ctrl-c in console, this fixes that
electron.app.on('before-quit', () => {
  electron.app.exit()
})

electron.app.on('open-url', (event, url) => {
  event.preventDefault()
  b.url = url
  if (b.window) {
    urlReceived(b.url, b.window)
  }
})
