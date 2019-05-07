import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  screen,
  Tray,
} from 'electron'
import { activities } from './config/activities'
import {
  ACTIVITIES_SET,
  ACTIVITY_RUN,
  COPY_TO_CLIPBOARD,
  FAV_SET,
  URL_RECEIVED,
  CLOSE_WINDOW,
  WINDOW_BLUR,
  LOG,
  MOUSE_THROUGH_ENABLE,
  MOUSE_THROUGH_DISABLE,
} from './config/events'
import { copyToClipboard } from './utils/copyToClipboard'
import { getInstalledActivities } from './utils/getInstalledActivities'
import { runCommand } from './utils/runCommand'
import * as Store from 'electron-store'

// Start store and set activities if first run
const store = new Store()

let urlToOpen: string | undefined // if started via clicking link
let appReady: boolean // if started via clicking link
let tray = null // prevents garbage collection
let pickerWindow: BrowserWindow // Prevents garbage collection

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
      icon: `${__dirname}/images/icon/icon.png`,
      maximizable: false,
      minimizable: false,
      movable: false,
      resizable: false,
      show: false,
      title: 'Browserosaurus',
      titleBarStyle: 'customButtonsOnHover',
      transparent: true,
      width: 400,
    })

    pickerWindow.loadURL(`file://${__dirname}/picker/index.html`)

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
  const display = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
  pickerWindow.setPosition(display.workArea.x, display.workArea.y, false)
  pickerWindow.setSize(display.workArea.width, display.workArea.height, false)
  pickerWindow.webContents.send(URL_RECEIVED, url)
  pickerWindow.show()
}

ipcMain.on(ACTIVITY_RUN, (_: Event, name: string) => {
  const activity = activities.find(act => act.name === name)
  activity && urlToOpen && runCommand(activity.cmd.replace('{URL}', urlToOpen))
  pickerWindow.webContents.send(WINDOW_BLUR)
})

ipcMain.on(COPY_TO_CLIPBOARD, () => {
  urlToOpen && copyToClipboard(urlToOpen)
})

ipcMain.on(CLOSE_WINDOW, () => {
  urlToOpen = undefined
  pickerWindow.hide()
})

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

  tray = new Tray(`${__dirname}/images/icon/tray_iconTemplate.png`)
  tray.setPressedImage(`${__dirname}/images/icon/tray_iconHighlight.png`)
  tray.setToolTip('Browserosaurus')
  const contextMenu: MenuItemConstructorOptions[] = [
    {
      label: 'Favourite',
      submenu: [{ label: 'Loading...' }],
    },
    {
      label: 'About',
      click: app.showAboutPanel,
    },
    {
      label: 'Quit',
      click: app.exit,
    },
  ]
  tray.setContextMenu(Menu.buildFromTemplate(contextMenu))

  await createPickerWindow()

  const acts = await getInstalledActivities()

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
    ...(acts.map(act => ({
      checked: act.name === fav,
      label: act.name,
      type: 'radio',
      click: () => {
        store.set('fav', act.name)
        pickerWindow.webContents.send(FAV_SET, act.name)
      },
    })) as MenuItemConstructorOptions[]),
  ])

  // reapply tray menu
  tray.setContextMenu(Menu.buildFromTemplate(contextMenu))

  // Send activities and fav down to picker
  pickerWindow.webContents.send(ACTIVITIES_SET, acts)
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

app.dock.hide() // Also prevents Browserosaurus from appearing in cmd-tab.
