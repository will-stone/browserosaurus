import { app, ipcMain } from 'electron'
import Store from 'electron-store'
import activities from './config/activities'
import { ACTIVITIES_GET, ACTIVITIES_SET, URL_RECEIVED, SET_FAVOURITE } from './config/events'
import createPickerWindow from './createPicker'
import createTrayIcon from './createTray'
import scanForApps from './utils/scanForApps'
import eventEmitter from './utils/eventEmitter'

// Start store and set activities if first run
const store = new Store({ defaults: { favourite: undefined } })

/**
 * Get Activities
 */
async function getActivities() {
  // get all apps on system
  // returns object of {appName: "appName"}
  const installedApps = await scanForApps()

  const isActivityAvailable = activity => {
    if (installedApps[activity.appId]) {
      return true
    } else if (!activity.appId) {
      // always show activity that does not depend on app presence
      return true
    }
    return false
  }

  const mapFavourite = activity => ({
    ...activity,
    favourite: store.get('favourite') === activity.name,
  })

  const installedActivities = activities.filter(isActivityAvailable).map(mapFavourite)

  eventEmitter.emit(ACTIVITIES_SET, installedActivities)

  return installedActivities
}

/**
 * Event: Get Activities
 *
 * Listens for the ACTIVITIES_GET event, triggered by the renderers on load.
 * Scans for apps and sends them on to the renderers.
 */
ipcMain.on(ACTIVITIES_GET, () => {
  getActivities()
})

eventEmitter.on(ACTIVITIES_GET, () => {
  getActivities()
})

eventEmitter.on(SET_FAVOURITE, browserName => {
  store.set('favourite', browserName)
  getActivities()
})

/**
 * Event: App Ready
 *
 * Run once electron has loaded and the app is considered _ready for use_.
 */
app.on('ready', async () => {
  // Prompt to set as default browser
  app.setAsDefaultProtocolClient('http')

  const activities = await getActivities()

  await Promise.all([createPickerWindow(activities), createTrayIcon(activities)])

  global.pickerReady = true

  if (global.URLToOpen) {
    // if Browserosaurus was opened with a link, this will now be sent on to the
    // picker window.
    eventEmitter.emit(URL_RECEIVED, global.URLToOpen)
    global.URLToOpen = null // not required any more
  }
})

// App doesn't always close on ctrl-c in console, this fixes that
app.on('before-quit', () => {
  app.exit()
})

/**
 * Event: Open URL
 *
 * When a URL is sent to Browserosaurus (as it is default browser), send it to
 * the picker.
 * @param {string} url
 */
app.on('open-url', (event, url) => {
  event.preventDefault()
  if (global.pickerReady) {
    eventEmitter.emit(URL_RECEIVED, url)
  } else {
    // app not ready yet, this will be handled later in the createWindow callback
    global.URLToOpen = url
  }
})

// Hide dock icon. Also prevents Browserosaurus from appearing in cmd-tab.
app.dock.hide()
