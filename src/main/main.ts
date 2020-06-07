import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  screen,
  Tray,
} from 'electron'
import Store from 'electron-store'
import execa from 'execa'
import fs from 'fs'
import os from 'os'

import { BrowserName, browsers } from '../config/browsers'
import {
  BROWSER_RUN,
  BROWSERS_SET,
  CLOSE_WINDOW,
  COPY_TO_CLIPBOARD,
  FAV_SET,
  LOG,
  MOUSE_THROUGH_DISABLE,
  MOUSE_THROUGH_ENABLE,
  OPT_TOGGLE,
  URL_RECEIVED,
  WINDOW_BLUR,
} from '../config/events'
import copyToClipboard from '../utils/copyToClipboard'
import getInstalledBrowsers from '../utils/getInstalledBrowsers'

// TODO This will be the default in Electron 9, remove once upgraded
app.allowRendererProcessReuse = true

// Config file
const dotBrowserosaurus: { ignored: string[] } = { ignored: [] }
try {
  const homedir = os.homedir()
  const file = fs.readFileSync(`${homedir}/.browserosaurus.json`, 'utf8')
  dotBrowserosaurus.ignored = JSON.parse(file).ignored
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error
  }
}

// Start store and set browsers if first run
const store = new Store()

let urlToOpen: string | null = null
let appReady: boolean
let isOptHeld = false

// Prevents garbage collection:
let tray: Tray
let pickerWindow: BrowserWindow

const createPickerWindow = () =>
  new Promise((resolve, reject) => {
    pickerWindow = new BrowserWindow({
      acceptFirstMouse: true,
      alwaysOnTop: true,
      closable: false,
      enableLargerThanScreen: true,
      frame: false,
      fullscreenable: false,
      hasShadow: false,
      height: 50,
      icon: `${__dirname}/static/icon/icon.png`,
      maximizable: false,
      minimizable: false,
      movable: false,
      resizable: false,
      show: false,
      title: 'Browserosaurus',
      titleBarStyle: 'customButtonsOnHover',
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        // eslint-disable-next-line no-undef
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
      width: 400,
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    // eslint-disable-next-line no-undef
    pickerWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

    pickerWindow.on('close', (evt) => {
      evt.preventDefault()
      pickerWindow.webContents.send(WINDOW_BLUR)
    })

    pickerWindow.on('blur', () => {
      pickerWindow.webContents.send(WINDOW_BLUR)
    })

    pickerWindow.once('ready-to-show', () => {
      // pickerWindow.webContents.openDevTools()
      resolve()
    })

    pickerWindow.once('unresponsive', reject)
  })

const urlRecevied = (url: string) => {
  const {
    workArea: { x, y, width, height },
  } = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
  pickerWindow.setPosition(x, y, false)
  pickerWindow.setSize(width, height, false)
  pickerWindow.webContents.send(URL_RECEIVED, url)
  pickerWindow.show()
}

ipcMain.on(BROWSER_RUN, (_: Event, name: BrowserName) => {
  const browser = browsers[name]
  if (urlToOpen) {
    if (isOptHeld) {
      execa('open', [urlToOpen, '-b', browser.appId, '-g'])
    } else {
      execa('open', [urlToOpen, '-b', browser.appId])
    }
  }

  pickerWindow.webContents.send(WINDOW_BLUR)
})

ipcMain.on(COPY_TO_CLIPBOARD, () => {
  if (urlToOpen) {
    copyToClipboard(urlToOpen)
  }

  pickerWindow.webContents.send(WINDOW_BLUR)
})

ipcMain.on(CLOSE_WINDOW, () => {
  isOptHeld = false
  urlToOpen = null
  pickerWindow.hide()
  app.hide()
  app.dock.hide()
})

ipcMain.on(OPT_TOGGLE, (_: Event, toggle: boolean) => {
  isOptHeld = toggle
})

/**
 * LOG
 *
 * Utility listener used for debugging.
 * Allows sending a string to the main process.
 */
ipcMain.on(
  LOG,
  (
    _: Event,
    {
      errorName,
      errorMessage,
      errorInfo,
    }: { errorName: string; errorMessage: string; errorInfo: object },
  ) => {
    // eslint-disable-next-line no-console
    console.log(errorName, errorMessage, errorInfo)
  },
)

ipcMain.on(MOUSE_THROUGH_ENABLE, () => {
  pickerWindow.setIgnoreMouseEvents(true, { forward: true })
})

ipcMain.on(MOUSE_THROUGH_DISABLE, () => {
  pickerWindow.setIgnoreMouseEvents(false)
})

app.on('ready', async () => {
  // Prompt to set as default browser
  app.setAsDefaultProtocolClient('http')

  const fav = store.get('fav') || 'Safari'

  const browserNames = (await getInstalledBrowsers()).filter(
    (name) => !dotBrowserosaurus.ignored.includes(name),
  )

  tray = new Tray(`${__dirname}/static/icon/tray_iconTemplate.png`)
  tray.setPressedImage(`${__dirname}/static/icon/tray_iconHighlight.png`)
  tray.setToolTip('Browserosaurus')
  const contextMenu: MenuItemConstructorOptions[] = [
    {
      label: 'Favourite',
      submenu: Menu.buildFromTemplate([
        ...(browserNames.map((browserName) => ({
          checked: browserName === fav,
          label: browserName,
          type: 'radio',
          click: () => {
            store.set('fav', browserName)
            pickerWindow.webContents.send(FAV_SET, browserName)
          },
        })) as MenuItemConstructorOptions[]),
      ]),
    },
    {
      type: 'separator',
    },
    {
      label: 'Quit',
      click: () => app.exit(),
    },
    {
      type: 'separator',
    },
    {
      label: `v${app.getVersion()}`,
      enabled: false,
    },
  ]
  tray.setContextMenu(Menu.buildFromTemplate(contextMenu))

  await createPickerWindow()

  // Send browsers and fav down to picker
  pickerWindow.webContents.send(BROWSERS_SET, browserNames)
  pickerWindow.webContents.send(FAV_SET, fav)

  if (urlToOpen) {
    // if Browserosaurus was opened with a link, this will now be sent on to the picker window.
    urlRecevied(urlToOpen)
  }

  appReady = true
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
