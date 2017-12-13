import openAboutWindow from 'about-window'
import { spawn } from 'child_process'
import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
import Store from 'electron-store'
import jp from 'jsonpath'
import parser from 'xml2json'

import defaultBrowsers from './browsers'

// Keep a global reference of the window objects, if you don't, the windows will
// be closed automatically when the JavaScript object is garbage collected.
let pickerWindow = null
let preferencesWindow = null
let tray = null
let appIsReady = false
let installedBrowsers = []
let wantToQuit = false

const defaultConfig = { browsers: defaultBrowsers }
const userConfig = {}

const store = new Store({ defaults: defaultConfig })

/**
 * Load config
 *
 * Syncs the default browser configuration with the store.
 * @returns {Promise} Simply returns true once config has been loaded.
 */
function loadConfig() {
  return new Promise(fulfill => {
    userConfig.browsers = store.get('browsers')

    let userBrowserFound

    // Create clone of the default browsers
    let defaultBrowsersClone = defaultConfig.browsers.slice(0)

    userConfig.browsers.map((userBrowser, userBrowserId) => {
      userBrowserFound = false

      defaultBrowsersClone.map((defBrowser, defBrowserId) => {
        if (defBrowser.name == userBrowser.name) {
          defaultBrowsersClone[defBrowserId] = false
          userBrowserFound = true
        }
      })

      if (userBrowserFound === false) {
        userConfig.browsers[userBrowserId] = false
      }
    })

    userConfig.browsers = userConfig.browsers.concat(defaultBrowsersClone)
    userConfig.browsers = userConfig.browsers.filter(x => x)

    store.set('browsers', userConfig.browsers)

    fulfill(true)
  })
}

/**
 * Find installed browsers
 *
 * Scans the system for all known browsers (in browsers.js file).
 * @returns {Promise} returns array of browsers if resolved, and string
 * if rejected.
 */
function findInstalledBrowsers() {
  return new Promise((fulfill, reject) => {
    const sp = spawn('system_profiler', ['-xml', 'SPApplicationsDataType'])

    let profile = ''

    sp.stdout.setEncoding('utf8')
    sp.stdout.on('data', data => {
      profile += data
    })
    sp.stderr.on('data', data => {
      console.log(`stderr: ${data}`)
      reject(data)
    })
    sp.stdout.on('end', () => {
      profile = parser.toJson(profile, { object: true })
      const installedApps = jp.query(
        profile,
        'plist.array.dict.array[1].dict[*].string[0]'
      )
      installedBrowsers = installedApps
        .map(appName => {
          for (let i = 0; i < userConfig.browsers.length; i++) {
            const browser = userConfig.browsers[i]
            if (browser.name === appName) {
              return browser
            }
          }
          return false
        })
        .filter(x => x) // remove empties
      fulfill(installedBrowsers)
    })
  })
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
    backgroundColor: '#111111'
  })

  pickerWindow.loadURL(`file://${__dirname}/picker.html`)

  pickerWindow.on('blur', () => {
    pickerWindow.webContents.send('close', true)
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
        togglePreferencesWindow(() => {
          preferencesWindow.webContents.send(
            'incomingBrowsers',
            installedBrowsers
          )
        })
      }
    },
    {
      label: 'About',
      click: function() {
        openAboutWindow({
          icon_path: `${__dirname}/images/icon/icon.png`
        })
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
 * @param {Function} callback function to run after this one finishes.
 */
function createPreferencesWindow(callback) {
  preferencesWindow = new BrowserWindow({
    width: 400,
    height: 64 + 24,
    icon: `${__dirname}/images/icon/icon.png`,
    resizable: false,
    show: false
  })

  // preferencesWindow.installedBrowsers = installedBrowsers
  preferencesWindow.loadURL(`file://${__dirname}/preferences.html`)
  // allow window to be opened again
  preferencesWindow.on('close', e => {
    if (wantToQuit == false) {
      e.preventDefault()
      preferencesWindow.hide()
    }
  })

  if (callback) {
    callback()
  }
}

/**
 * Toggle Preferences Window
 *
 * Shows and brings preferences window to front.
 * @param {Function} callback function to run after this one finishes.
 */
function togglePreferencesWindow(callback) {
  if (!preferencesWindow) {
    createPreferencesWindow(callback)
  } else {
    // Bring to front
    preferencesWindow.show()
    callback()
  }
}

function arraySwap(array, x, y) {
  array[x] = array.splice(y, 1, array[x])[0]
  return array
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
  const browserIndex = userConfig.browsers.findIndex(
    browser => browser.name === browserName
  )
  userConfig.browsers[browserIndex].enabled = enabled
  store.set('browsers', userConfig.browsers)
  pickerWindow.webContents.send('incomingBrowsers', installedBrowsers)
})

ipcMain.on('sort-browser', (event, { oldIndex, newIndex }) => {
  const from = installedBrowsers[oldIndex].name
  const to = installedBrowsers[newIndex].name
  const fromIndex = userConfig.browsers.findIndex(
    browser => browser.name === from
  )
  const toIndex = userConfig.browsers.findIndex(browser => browser.name === to)
  userConfig.browsers = arraySwap(userConfig.browsers, fromIndex, toIndex)
  store.set('browsers', userConfig.browsers)
  findInstalledBrowsers().then(installedBrowsers => {
    pickerWindow.webContents.send('incomingBrowsers', installedBrowsers)
  })
})

/**
 * App on ready
 *
 * Run once electron has loaded and the app is considered _ready for use_.
 */
app.on('ready', () => {
  // Prompt to set as default browser
  app.setAsDefaultProtocolClient('http')

  loadConfig().then(() => {
    createTrayIcon()
    createPickerWindow(() => {
      pickerWindow.once('ready-to-show', () => {
        if (global.URLToOpen) {
          sendUrlToPicker(global.URLToOpen)
          global.URLToOpen = null
        }
        appIsReady = true
      })
    })
    createPreferencesWindow()
    findInstalledBrowsers().then(installedBrowsers => {
      pickerWindow.webContents.send('incomingBrowsers', installedBrowsers)
      preferencesWindow.webContents.send('incomingBrowsers', installedBrowsers)
    })
  })
  //)
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
    global.URLToOpen = url // this will be handled later in the createWindow callback
  }
})
