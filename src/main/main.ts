import { app, autoUpdater, BrowserWindow, ipcMain } from 'electron'
import isDev from 'electron-is-dev'
import Store from 'electron-store'
import execa from 'execa'
import flatten from 'lodash/fp/flatten'
import partition from 'lodash/fp/partition'
import pipe from 'lodash/fp/pipe'

import pkg from '../../package.json'
import { Browser } from '../config/browsers'
import {
  BROWSER_RUN,
  BROWSERS_GET,
  BROWSERS_SET,
  COPY_TO_CLIPBOARD,
  OPT_TOGGLE,
  URL_RECEIVED,
} from '../config/events'
import copyToClipboard from '../utils/copyToClipboard'
import getInstalledBrowsers from '../utils/getInstalledBrowsers'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// TODO This will be the default in Electron 9, remove once upgraded
app.allowRendererProcessReuse = true

// Attempt to fix this bug: https://github.com/electron/electron/issues/20944
app.commandLine.appendArgument('--enable-features=Metal')

// Start store and set browsers if first run
const store = new Store()

let urlToOpen: string | null = null
let appReady: boolean
let isOptHeld = false

// Prevents garbage collection:
let pickerWindow: BrowserWindow

function createWindow() {
  return new Promise((resolve, reject) => {
    pickerWindow = new BrowserWindow({
      backgroundColor: '#2E2F30',
      frame: true,
      icon: `${__dirname}/static/icon/icon.png`,
      title: 'Browserosaurus',
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        nodeIntegration: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
      height: 600,
      width: 850,
      show: false,
    })

    pickerWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

    pickerWindow.on('close', (evt) => {
      evt.preventDefault()
      pickerWindow.hide()
    })

    pickerWindow.once('ready-to-show', () => {
      pickerWindow.show()
      // pickerWindow.webContents.openDevTools()
      resolve()
    })

    pickerWindow.once('unresponsive', reject)
  })
}

const urlRecevied = (url: string) => {
  pickerWindow.webContents.send(URL_RECEIVED, url)
  pickerWindow.show()
}

// Send browsers down to picker
ipcMain.on(BROWSERS_GET, async () => {
  const installedBrowsers = await getInstalledBrowsers()
  const favBrowserId = store.get('fav') || 'com.apple.Safari'
  const favFirst = pipe(partition({ appId: favBrowserId }), flatten)
  const browsers = favFirst(installedBrowsers)
  pickerWindow.webContents.send(BROWSERS_SET, browsers)
})

ipcMain.on(BROWSER_RUN, (_: Event, browserId: string) => {
  if (urlToOpen) {
    if (isOptHeld) {
      isOptHeld = false
      execa('open', [urlToOpen, '-b', browserId, '-g'])
    } else {
      execa('open', [urlToOpen, '-b', browserId])
    }
  }
})

ipcMain.on(COPY_TO_CLIPBOARD, (_: Event, url: string) => {
  copyToClipboard(url)
})

ipcMain.on(OPT_TOGGLE, (_: Event, toggle: boolean) => {
  isOptHeld = toggle
})

app.on('ready', async () => {
  // Prompt to set as default browser
  app.setAsDefaultProtocolClient('http')

  await createWindow()

  if (urlToOpen) {
    // if Browserosaurus was opened with a link, this will now be sent on to the picker window.
    urlRecevied(urlToOpen)
  }

  // Auto update on production
  if (!isDev) {
    const feedURL = `https://update.electronjs.org/will-stone/browserosaurus/darwin-x64/${app.getVersion()}`

    autoUpdater.setFeedURL({
      url: feedURL,
      headers: {
        'User-Agent': `${pkg.name}/${pkg.version} (darwin: x64)`,
      },
    })

    autoUpdater.on('update-downloaded', () => {
      return null
    })

    autoUpdater.on('before-quit-for-update', () => {
      // All windows must be closed before an update can be applied using "restart".
      pickerWindow.destroy()
    })

    autoUpdater.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.log('updater error', err)
    })

    // check for updates right away and keep checking later
    const TEN_MINS = 600000
    autoUpdater.checkForUpdates()
    setInterval(() => {
      autoUpdater.checkForUpdates()
    }, TEN_MINS)
  }

  appReady = true
})

app.on('activate', () => {
  pickerWindow.show()
})

// App doesn't always close on ctrl-c in console, this fixes that
app.on('before-quit', () => {
  app.exit()
})

app.on('open-url', (event, url) => {
  event.preventDefault()
  urlToOpen = url
  if (appReady) {
    urlRecevied(urlToOpen)
  }
})
