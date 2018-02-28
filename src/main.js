import arrayMove from 'array-move'
import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
import Store from 'electron-store'
import unionBy from 'lodash/unionBy'

import whiteListedBrowsers from './config/browsers'

import scanForApps from './utils/scanForApps'

// Keep a global reference of the window objects, if you don't, the windows will
// be closed automatically when the JavaScript object is garbage collected.
let pickerWindow = null
let prefsWindow = null
let tray = null
let appIsReady = false
let wantToQuit = false

// Start store and set browsers if first run
const store = new Store({ defaults: { browsers: [] } })

/**
 * Create Picker Window
 *
 * Creates the window that is used to display browser selection after clicking
 * a link.
 * @param {function} callback - function to run at the end of this one.
 * @returns {null}
 */
function createPickerWindow() {
  return new Promise((resolve, reject) => {
    pickerWindow = new BrowserWindow({
      width: 400,
      height: 112,
      acceptFirstMouse: true,
      alwaysOnTop: true,
      icon: `${__dirname}/images/icon/icon.png`,
      frame: false,
      resizable: false,
      movable: false,
      show: false,
      title: 'Browserosaurus',
      hasShadow: true,
      backgroundColor: '#21252b'
    })

    pickerWindow.loadURL(`file://${__dirname}/renderers/picker/picker.html`)

    pickerWindow.on('close', e => {
      if (wantToQuit === false) {
        e.preventDefault()
        pickerWindow.hide()
      }
    })

    pickerWindow.on('blur', () => {
      pickerWindow.hide()
    })

    pickerWindow.once('ready-to-show', () => {
      // pickerWindow.webContents.openDevTools()
      resolve()
    })

    pickerWindow.once('unresponsive', () => {
      console.log('unresponsive')
      reject()
    })
  })
}

/**
 * Create Tray Icon
 *
 * Creates the menubar icon and menu items.
 * @returns {null}
 */
function createTrayIcon() {
  return new Promise((resolve, reject) => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Preferences',
        click: function() {
          if (!prefsWindow) {
            createPrefsWindow()
          } else {
            // Bring to front
            prefsWindow.center()
            prefsWindow.show()
          }
        }
      },
      {
        label: 'Quit',
        click: function() {
          wantToQuit = true
          app.quit()
        }
      }
    ])

    tray = new Tray(`${__dirname}/images/icon/tray_iconTemplate.png`)

    tray.setPressedImage(`${__dirname}/images/icon/tray_iconHighlight.png`)

    tray.setToolTip('Browserosaurus')

    tray.setContextMenu(contextMenu)

    resolve()
  })
}

/**
 * Create Prefs Window
 *
 * Creates the window used to display the preferences, triggered from the
 * menubar icon.
 * @returns {null}
 */
function createPrefsWindow() {
  return new Promise((resolve, reject) => {
    prefsWindow = new BrowserWindow({
      width: 500,
      height: 146,
      icon: `${__dirname}/images/icon/icon.png`,
      resizable: false,
      show: false,
      alwaysOnTop: true,
      frame: true,
      hasShadow: true,
      minimizable: false,
      maximizable: false,
      titleBarStyle: 'hidden',
      backgroundColor: '#21252b'
    })

    prefsWindow.loadURL(`file://${__dirname}/renderers/prefs/prefs.html`)

    // allow window to be opened again
    prefsWindow.on('close', e => {
      if (wantToQuit === false) {
        e.preventDefault()
        prefsWindow.hide()
      }
    })

    prefsWindow.once('ready-to-show', () => {
      resolve()
    })

    prefsWindow.once('unresponsive', () => {
      console.log('unresponsive')
      reject()
    })
  })
}

/**
 * Event: Toggle Browser
 *
 * Listens for the toggle-browser event, triggered from the prefs renderer and
 * updates the enabled/disabled status of the checked/unchecked browser. Then
 * sends updated browsers array back to renderers.
 * @param {string} browserName
 * @param {boolean} enabled
 */
ipcMain.on('toggle-browser', (event, { browserName, enabled }) => {
  const browsers = store.get('browsers')
  const browserIndex = browsers.findIndex(
    browser => browser.name === browserName
  )
  browsers[browserIndex].enabled = enabled
  store.set('browsers', browsers)
  pickerWindow.webContents.send('browsers', browsers)
  prefsWindow.webContents.send('browsers', browsers)
})

/**
 * Event: Sort Browser
 *
 * Listens for the sort-browser event, triggered from the prefs renderer when a
 * browser is dragged to a new position. Then sends updated browsers array back
 * to renderers.
 * @param {number} oldIndex - index of browser being moved from.
 * @param {number} newIndex - index of place browser is being moved to.
 */
ipcMain.on('sort-browser', (event, { oldIndex, newIndex }) => {
  const browsers = arrayMove(store.get('browsers'), oldIndex, newIndex)
  store.set('browsers', browsers)
  pickerWindow.webContents.send('browsers', browsers)
  prefsWindow.webContents.send('browsers', browsers)
})

/**
 * Get Browsers
 */
async function getBrowsers() {
  // get all apps on system
  const installedApps = await scanForApps()

  // filter the apps to just the browsers on system
  const installedBrowsers = Object.keys(whiteListedBrowsers)
    .map(name => {
      for (let i = 0; i < installedApps.length; i++) {
        if (name === installedApps[i]) {
          return name
        }
      }
      return null
    })
    .filter(x => x) // remove empties

  // get browsers in store
  const storedBrowsers = store.get('browsers')

  // convert each installed browser string to object with keyboard shortcut, alias name, and enabled status details.
  const installedBrowsersWithDetails = installedBrowsers.map(name => ({
    name,
    key: whiteListedBrowsers[name].key,
    alias: whiteListedBrowsers[name].alias || null,
    enabled: true
  }))

  // remove unistalled browsers from stored config
  const storedBrowsersPruned = storedBrowsers
    .map(browser => {
      if (installedBrowsers.indexOf(browser.name) === -1) {
        return null
      }
      return browser
    })
    .filter(x => x) // remove nulls

  // merge the stored with installed browsers, this will add new browsers where necessary, keeping the stored config if present.
  const mergedBrowsers = unionBy(
    storedBrowsersPruned,
    installedBrowsersWithDetails,
    'name'
  )

  store.set('browsers', mergedBrowsers)

  return mergedBrowsers
}

/**
 * Event: Get Browsers
 *
 * Listens for the get-browsers event, triggered by the renderers on load.
 * Scans for browsers and sends them on to the browsers.
 */
ipcMain.on('get-browsers', async event => {
  const browsers = await getBrowsers()
  // event.sender.send('browsers', browsers)
  pickerWindow.webContents.send('browsers', browsers)
  prefsWindow.webContents.send('browsers', browsers)
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

  appIsReady = true

  if (global.URLToOpen) {
    // if Browserosaurus was opened with a link, this will now be sent on to the picker window
    pickerWindow.webContents.send('incomingURL', global.URLToOpen)
    global.URLToOpen = null // not required any more
  }

  const browsers = await getBrowsers()
  pickerWindow.webContents.send('browsers', browsers)
  prefsWindow.webContents.send('browsers', browsers)

  createTrayIcon() // create tray icon last as otherwise it loads before prefs window is ready and causes browsers to not be sent through.
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
  if (appIsReady) {
    pickerWindow.webContents.send('incomingURL', url)
  } else {
    // app not ready yet, this will be handled later in the createWindow callback
    global.URLToOpen = url
  }
})

// Hide dock icon. Also prevents Browserosaurus from appearing in cmd-tab.
app.dock.hide()
