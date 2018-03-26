import arrayMove from 'array-move'
import { app, ipcMain } from 'electron'
import Store from 'electron-store'
// import unionBy from 'lodash/unionBy'
// import pick from 'lodash/pick'

// import whiteListedBrowsers from './config/browsers'
import activities from './config/activities'
import {
  ACTIVITY_SORT,
  ACTIVITY_TOGGLE,
  BROWSERS_GET,
  BROWSERS_SET,
  URL_RECEIVED
} from './config/events'

import createPickerWindow from './main/createPicker'
import createPrefsWindow from './main/createPrefs'
import createTrayIcon from './main/createTray'
import eventEmitter from './main/eventEmitter'
import scanForApps from './main/scanForApps'
// import valuesWithKey from './main/valuesWithKey'

// Start store and set browsers if first run
const store = new Store({ defaults: { browsers: [] } })

/**
 * Event: Toggle Browser
 *
 * Listens for the ACTIVITY_TOGGLE event, triggered from the prefs renderer and
 * updates the enabled/disabled status of the checked/unchecked browser. Then
 * sends updated browsers array back to renderers.
 * @param {string} browserName
 * @param {boolean} enabled
 */
ipcMain.on(ACTIVITY_TOGGLE, (event, { browserName, enabled }) => {
  const browsers = store.get('browsers')
  const browserIndex = browsers.findIndex(
    browser => browser.name === browserName
  )
  browsers[browserIndex].enabled = enabled
  // store.set('browsers', browsers)
  eventEmitter.emit(BROWSERS_SET, browsers)
})

/**
 * Event: Sort Browser
 *
 * Listens for the ACTIVITY_SORT event, triggered from the prefs renderer when a
 * browser is dragged to a new position. Then sends updated browsers array back
 * to renderers.
 * @param {number} oldIndex - index of browser being moved from.
 * @param {number} newIndex - index of place browser is being moved to.
 */
ipcMain.on(ACTIVITY_SORT, (event, { oldIndex, newIndex }) => {
  const browsers = arrayMove(store.get('browsers'), oldIndex, newIndex)
  // store.set('browsers', browsers)
  eventEmitter.emit(BROWSERS_SET, browsers)
})

/**
 * Get Browsers
 */
async function getBrowsers() {
  // get all apps on system
  // returns object of {appName: "appName"}
  const installedApps = await scanForApps()

  const installedActivities = activities
    .filter(activity => {
      if (installedApps[activity.appId]) {
        return true
      } else if (!activity.appId) {
        // always shown activity that does not depend on app presence
        return true
      }
      return false
    })
    // add enabled status
    .map(obj => ({
      ...obj,
      enabled: true
    }))

  // get browsers in store
  // returns array of objects
  // const stored = store.get('browsers')

  // remove unistalled browsers from stored config
  // returns array of objects
  // const prunedStore = stored.filter(app => installedApps.indexOf(app.name) > -1)

  // filter the whitelisted browsers to just browsers on system
  // returns object of objects
  // const allowed = pick(activities, installedApps)
  // const allowed = pick(whiteListedBrowsers, installedApps)

  // flattens the object, keeping the keys as name key on nested objects
  // returns array of objects
  // const allowedArray = valuesWithKey(allowed, 'name')

  // merge the stored with installed apps, this will add new apps where necessary, keeping the stored config if present.
  // returns array of objects
  // const merged = unionBy(prunedStore, allowedArrayEnabled, 'name')

  // store.set('browsers', merged)

  eventEmitter.emit(BROWSERS_SET, installedActivities)

  return true
}

/**
 * Event: Get Browsers
 *
 * Listens for the BROWSERS_GET event, triggered by the renderers on load.
 * Scans for browsers and sends them on to the browsers.
 */
ipcMain.on(BROWSERS_GET, async () => {
  await getBrowsers()
})

/**
 * Event: App Ready
 *
 * Run once electron has loaded and the app is considered _ready for use_.
 */
app.on('ready', async () => {
  // Prompt to set as default browser
  app.setAsDefaultProtocolClient('http')

  await Promise.all([createPrefsWindow(), createPickerWindow()])

  global.pickerReady = true

  if (global.URLToOpen) {
    // if Browserosaurus was opened with a link, this will now be sent on to the picker window
    eventEmitter.emit(URL_RECEIVED, global.URLToOpen)
    global.URLToOpen = null // not required any more
  }

  await getBrowsers()

  createTrayIcon() // create tray icon last as otherwise it loads before prefs window is ready and causes browsers to not be sent through.
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
