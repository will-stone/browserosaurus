import { app, ipcMain, Menu, MenuItemConstructorOptions, Tray } from 'electron'
import { activities } from './config/activities'
import {
  ACTIVITIES_SET,
  ACTIVITY_RUN,
  FAV_SET,
  URL_RECEIVED,
  WINDOW_HIDE,
  MOUSE_EVENTS_IGNORE,
} from './config/events'
import { createPickerWindow } from './main.createPicker'
import { eventEmitter } from './utils/eventEmitter'
import { getInstalledActivities } from './utils/getInstalledActivities'
import { runCommand } from './utils/runCommand'
import Store = require('electron-store')

// Start store and set activities if first run
const store = new Store({ defaults: { fav: undefined } })

let urlToOpen: string | undefined // if started via clicking link
let tray = null // prevents garbage collection

ipcMain.on(ACTIVITY_RUN, (_: Event, arg: { name: string; url: string }) => {
  const activity = activities.find(act => act.name === arg.name)
  activity && runCommand(activity.cmd.replace('{URL}', arg.url))
})
ipcMain.on(MOUSE_EVENTS_IGNORE, () => eventEmitter.emit(MOUSE_EVENTS_IGNORE))
ipcMain.on(WINDOW_HIDE, () => eventEmitter.emit(WINDOW_HIDE))

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
  contextMenu[0].submenu = Menu.buildFromTemplate(acts.map(act => ({
    checked: act.name === fav,
    label: act.name,
    type: 'radio',
    click: () => {
      store.set('fav', act.name)
      eventEmitter.emit(FAV_SET, act.name)
    },
  })) as MenuItemConstructorOptions[])

  // reapply tray menu
  tray.setContextMenu(Menu.buildFromTemplate(contextMenu))

  // Send activities and fav down to picker
  eventEmitter.emit(ACTIVITIES_SET, acts)
  eventEmitter.emit(FAV_SET, fav)

  if (urlToOpen) {
    // if Browserosaurus was opened with a link, this will now be sent on to the picker window.
    eventEmitter.emit(URL_RECEIVED, urlToOpen)
    urlToOpen = undefined // not required any more
  }
})

// App doesn't always close on ctrl-c in console, this fixes that
app.on('before-quit', () => {
  app.exit()
})

app.on('open-url', (event, url) => {
  event.preventDefault()
  if (app.isReady()) {
    eventEmitter.emit(URL_RECEIVED, url)
  } else {
    // app not ready yet, this will be handled later in the createWindow callback
    urlToOpen = url
  }
})

app.dock.hide() // Also prevents Browserosaurus from appearing in cmd-tab.
