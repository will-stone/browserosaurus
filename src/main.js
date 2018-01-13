import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
import Store from 'electron-store'
import fetch from 'node-fetch'
import semver from 'semver'
import unionBy from 'lodash/unionBy'

import whiteListedBrowsers from './config/browsers'

import findInstalledBrowsers from './utils/findInstalledBrowsers'
import arrayMove from './utils/arrayMove'

// Keep a global reference of the window objects, if you don't, the windows will
// be closed automatically when the JavaScript object is garbage collected.
let pickerWindow = null
let preferencesWindow = null
let tray = null
let appIsReady = false
let wantToQuit = false

// Start store and set browsers if it is the first run
const store = new Store({ defaults: { browsers: [] } })

function sendBrowsersToRenderers(browsers) {
  const enabledBrowsers = browsers.filter(browser => browser.enabled)
  pickerWindow.webContents.send('incomingBrowsers', enabledBrowsers)
  preferencesWindow.webContents.send('incomingBrowsers', browsers)
}

/**
 * Create picker window
 *
 * Creates the window that is used to display browser selection after clicking
 * a link.
 * @param {Function} callback function to run after this one finishes.
 */
function createPickerWindow(callback) {
  pickerWindow = new BrowserWindow({
    width: 400,
    height: 64 + 48,
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

  pickerWindow.loadURL(`file://${__dirname}/picker/picker.html`)

  pickerWindow.on('close', e => {
    if (wantToQuit == false) {
      e.preventDefault()
      pickerWindow.hide()
    }
  })

  pickerWindow.on('blur', () => {
    pickerWindow.hide()
  })

  if (callback) {
    callback()
  }
}

/**
 * Create tray icon
 *
 * Creates the menubar icon and menu items.
 * @returns {null}
 */
function createTrayIcon() {
  tray = new Tray(`${__dirname}/images/icon/tray_iconTemplate.png`)
  tray.setPressedImage(`${__dirname}/images/icon/tray_iconHighlight.png`)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Preferences',
      click: function() {
        togglePreferencesWindow()
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
  tray.setToolTip('Browserosaurus')
  tray.setContextMenu(contextMenu)

  return null
}

function checkForUpdate() {
  return fetch(
    'https://api.github.com/repos/will-stone/browserosaurus/releases/latest'
  )
    .then(response => response.json())
    .then(response => {
      if (
        response.message &&
        response.message.startsWith('API rate limit exceeded')
      ) {
        return 'API rate limit exceeded, please try again later'
      } else if (semver.gt(response.tag_name, app.getVersion())) {
        return response.assets[0].browser_download_url
      } else {
        return false
      }
    })
}

ipcMain.on('check-for-update', async () => {
  try {
    const updateAvailable = await checkForUpdate()
    preferencesWindow.webContents.send('updateAvailable', updateAvailable)
  } catch (err) {
    console.log(err)
  }
})

/**
 * Send URL to picker
 *
 * When url is clicked, this sends the url to the picker renderer so browsers
 * know what to open.
 * @param {String} url clicked link.
 */
function sendUrlToPicker(url) {
  pickerWindow.center() // moves window to current screen
  pickerWindow.webContents.send('incomingURL', url)
}

/**
 * Create Preferences Window
 *
 * Creates the window used to display the preferences, triggered from the
 * menubar icon.
 */
function createPreferencesWindow() {
  preferencesWindow = new BrowserWindow({
    width: 400,
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
    backgroundColor: '#21252b',
    minimizable: false,
    maximizable: false
  })

  preferencesWindow.loadURL(`file://${__dirname}/preferences/preferences.html`)

  // allow window to be opened again
  preferencesWindow.on('close', e => {
    if (wantToQuit == false) {
      e.preventDefault()
      preferencesWindow.hide()
    }
  })
}

/**
 * Toggle Preferences Window
 *
 * Shows and brings preferences window to front.
 */
function togglePreferencesWindow() {
  if (!preferencesWindow) {
    createPreferencesWindow()
  } else {
    // Bring to front
    preferencesWindow.center()
    preferencesWindow.show()
  }
}

/**
 * Toggle browser event
 *
 * Listens for the toggle-browser event, triggered from the picker renderer and
 * updates the enabled/disabled status of the checked/unchecked browser.
 * @param {String} browserName
 * @param {Boolean} enabled
 */
ipcMain.on('toggle-browser', (event, { browserName, enabled }) => {
  const browsers = store.get('browsers')
  const browserIndex = browsers.findIndex(
    browser => browser.name === browserName
  )
  browsers[browserIndex].enabled = enabled
  store.set('browsers', browsers)
  sendBrowsersToRenderers(browsers)
})

/**
 * Sort browser event
 *
 * Listens for the sort-browser event, triggered from the preferences renderer
 * when a browser is dragged to a new position.
 * @param {Number} oldIndex index of browser being moved from.
 * @param {Number} newIndex index of place browser is being moved to.
 */
ipcMain.on('sort-browser', (event, { oldIndex, newIndex }) => {
  const browsers = arrayMove(store.get('browsers'), oldIndex, newIndex)
  store.set('browsers', browsers)
  pickerWindow.webContents.send('incomingBrowsers', browsers)
})

/**
 * App on ready
 *
 * Run once electron has loaded and the app is considered _ready for use_.
 */
app.on('ready', () => {
  // Prompt to set as default browser
  app.setAsDefaultProtocolClient('http')

  createTrayIcon()
  createPreferencesWindow()
  createPickerWindow(() => {
    pickerWindow.once('ready-to-show', () => {
      findInstalledBrowsers(whiteListedBrowsers)
        .then(installedBrowsers => {
          const storedBrowsers = store.get('browsers')

          // remove unistalled browsers from user config
          const storedBrowsersPruned = storedBrowsers
            .map(browser => {
              if (installedBrowsers.indexOf(browser.name) === -1) {
                return null
              }
              return browser
            })
            .filter(x => x)

          const installedBrowsersWithDetails = installedBrowsers.map(name => ({
            name,
            key: whiteListedBrowsers[name].key,
            alias: whiteListedBrowsers[name].alias || null,
            enabled: true
          }))

          const mergedBrowsers = unionBy(
            storedBrowsersPruned,
            installedBrowsersWithDetails,
            'name'
          )

          sendBrowsersToRenderers(mergedBrowsers)
          store.set('browsers', mergedBrowsers)
        })
        .catch(err => console.error(err))

      if (global.URLToOpen) {
        sendUrlToPicker(global.URLToOpen)
        global.URLToOpen = null
      }
      appIsReady = true
    })
  })
})

// Hide dock icon. Also prevents Browserosaurus from appearing in cmd-tab.
app.dock.hide()

/**
 * App on open URL
 *
 * When a URL is sent to Browserosaurus (as it is default browser), send it to
 * the picker.
 */
app.on('open-url', (event, url) => {
  event.preventDefault()
  if (appIsReady) {
    sendUrlToPicker(url)
  } else {
    // this will be handled later in the createWindow callback
    global.URLToOpen = url
  }
})
