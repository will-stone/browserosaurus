import {
  app,
  autoUpdater,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  screen,
  Tray,
} from 'electron'
import isDev from 'electron-is-dev'
import Store from 'electron-store'
import pkg from '../../package.json'
import { activities, ActivityName } from '../config/activities'
import {
  ACTIVITIES_SET,
  ACTIVITY_RUN,
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
import { copyToClipboard } from '../utils/copyToClipboard'
import { getInstalledActivities } from '../utils/getInstalledActivities'
import { runCommand } from '../utils/runCommand'

// Start store and set activities if first run
const store = new Store()

let urlToOpen: string | undefined // if started via clicking link
let appReady: boolean // if started via clicking link
let tray = null // prevents garbage collection
let pickerWindow: BrowserWindow // Prevents garbage collection
let isOptHeld = false

function initUpdater() {
  const feedURL = `https://update.electronjs.org/will-stone/browserosaurus/darwin-x64/${app.getVersion()}`

  const requestHeaders = {
    'User-Agent': `${pkg.name}/${pkg.version} (darwin: x64)`,
  }

  autoUpdater.setFeedURL({ url: feedURL, headers: requestHeaders })

  autoUpdater.on('checking-for-update', () => {})

  autoUpdater.on('update-available', () => {})

  autoUpdater.on('update-not-available', () => {})

  autoUpdater.on('update-downloaded', (_, __, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: releaseName,
      detail:
        'A new version has been downloaded. Restart the application to apply the updates.',
    }

    dialog.showMessageBox(dialogOpts, response => {
      if (response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
  })

  autoUpdater.on('before-quit-for-update', () => {
    // All windows must be closed before an update can be applied using "restart".
    pickerWindow.destroy()
  })

  // check for updates right away and keep checking later
  const TEN_MINS = 600000
  autoUpdater.checkForUpdates()
  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, TEN_MINS)
}

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
        // @ts-ignore
        // eslint-disable-next-line no-undef
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
      width: 400,
    })

    // @ts-ignore
    // eslint-disable-next-line no-undef
    pickerWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

    pickerWindow.on('close', e => {
      e.preventDefault()
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

ipcMain.on(ACTIVITY_RUN, (_: Event, name: ActivityName) => {
  const activity = activities[name]
  if (urlToOpen) {
    if (isOptHeld && activity.optCmd) {
      runCommand(activity.optCmd.replace('{URL}', urlToOpen))
    } else {
      runCommand(activity.cmd.replace('{URL}', urlToOpen))
    }
  }
  pickerWindow.webContents.send(WINDOW_BLUR)
})

ipcMain.on(COPY_TO_CLIPBOARD, () => {
  urlToOpen && copyToClipboard(urlToOpen)
})

ipcMain.on(CLOSE_WINDOW, () => {
  isOptHeld = false
  urlToOpen = undefined
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
ipcMain.on(LOG, (_: Event, msg: string) => {
  // eslint-disable-next-line no-console
  console.log(msg)
})

ipcMain.on(MOUSE_THROUGH_ENABLE, () => {
  pickerWindow.setIgnoreMouseEvents(true, { forward: true })
})

ipcMain.on(MOUSE_THROUGH_DISABLE, () => {
  pickerWindow.setIgnoreMouseEvents(false)
})

app.on('ready', async () => {
  // Prompt to set as default browser
  app.setAsDefaultProtocolClient('http')

  const fav = store.get('fav')

  tray = new Tray(`${__dirname}/static/icon/tray_iconTemplate.png`)
  tray.setPressedImage(`${__dirname}/static/icon/tray_iconHighlight.png`)
  tray.setToolTip('Browserosaurus')
  const contextMenu: MenuItemConstructorOptions[] = [
    {
      label: 'Favourite',
      submenu: [{ label: 'Loading...' }],
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
      label: 'v' + app.getVersion(),
      enabled: false,
    },
  ]
  tray.setContextMenu(Menu.buildFromTemplate(contextMenu))

  await createPickerWindow()

  const actNames = await getInstalledActivities()

  // update fav-chooser with activity list
  contextMenu[0].submenu = Menu.buildFromTemplate([
    {
      checked: fav === null,
      label: 'No Favourite',
      type: 'radio',
      click: () => {
        store.set('fav', null)
        pickerWindow.webContents.send(FAV_SET, null)
      },
    },
    ...(actNames.map(actName => ({
      checked: actName === fav,
      label: actName,
      type: 'radio',
      click: () => {
        store.set('fav', actName)
        pickerWindow.webContents.send(FAV_SET, actName)
      },
    })) as MenuItemConstructorOptions[]),
  ])

  // reapply tray menu
  tray.setContextMenu(Menu.buildFromTemplate(contextMenu))

  // Send activities and fav down to picker
  pickerWindow.webContents.send(ACTIVITIES_SET, actNames)
  pickerWindow.webContents.send(FAV_SET, fav)

  if (urlToOpen) {
    // if Browserosaurus was opened with a link, this will now be sent on to the picker window.
    urlRecevied(urlToOpen)
  }

  if (!isDev) {
    initUpdater()
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

app.dock.hide() // Also prevents Browserosaurus from appearing in cmd-tab.
