import { app, ipcMain } from 'electron'
import activities from './config/activities'
import {
  ACTIVITIES_GET,
  ACTIVITIES_SET,
  ACTIVITY_RUN,
  FAV_SET,
  URL_RECEIVED,
  FAV_GET,
} from './config/events'
import createPickerWindow from './main.createPicker'
import createTrayIcon from './main.createTray'
import eventEmitter from './utils/eventEmitter'
import { getInstalledActivities } from './utils/getInstalledActivities'
import { runCommand } from './utils/runCommand'
import Store = require('electron-store')

// Start store and set activities if first run
const store = new Store({ defaults: { fav: undefined } })

let pickerReady = false
let urlToOpen: string | undefined

ipcMain.on(ACTIVITIES_GET, () => {
  eventEmitter.emit(ACTIVITIES_GET)
})

eventEmitter.on(ACTIVITIES_GET, async () => {
  const acts = await getInstalledActivities()
  eventEmitter.emit(ACTIVITIES_SET, acts)
})

ipcMain.on(FAV_GET, () => {
  eventEmitter.emit(FAV_GET)
})

eventEmitter.on(FAV_GET, () => {
  eventEmitter.emit(FAV_SET, store.get('fav'))
})

eventEmitter.on(FAV_SET, async (browserName: string) => {
  store.set('fav', browserName)
  // const acts = await getInstalledActivities()
  // eventEmitter.emit(ACTIVITIES_SET, acts)
})

ipcMain.on(ACTIVITY_RUN, (_: Event, arg: { name: string; url: string }) => {
  const activity = activities.find(act => act.name === arg.name)
  activity && runCommand(activity.cmd.replace('{URL}', arg.url))
})

app.on('ready', () => {
  // Prompt to set as default browser
  app.setAsDefaultProtocolClient('http')

  createPickerWindow().then(() => {
    pickerReady = true
    if (urlToOpen) {
      // if Browserosaurus was opened with a link, this will now be sent on to the picker window.
      eventEmitter.emit(URL_RECEIVED, urlToOpen)
      urlToOpen = undefined // not required any more
    }
  })

  getInstalledActivities().then(acts => createTrayIcon(acts))
})

// App doesn't always close on ctrl-c in console, this fixes that
app.on('before-quit', () => {
  app.exit()
})

app.on('open-url', (event, url) => {
  event.preventDefault()
  if (pickerReady) {
    eventEmitter.emit(URL_RECEIVED, url)
  } else {
    // app not ready yet, this will be handled later in the createWindow callback
    urlToOpen = url
  }
})

app.dock.hide() // Also prevents Browserosaurus from appearing in cmd-tab.
