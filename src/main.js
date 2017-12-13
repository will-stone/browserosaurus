import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
import jp from 'jsonpath'
import { spawn } from 'child_process'
import parser from 'xml2json'
import openAboutWindow from 'about-window'
import Store from 'electron-store'

import defaultBrowsers from './browsers'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let pickerWindow = null
let preferencesWindow = null
let tray = null
let appIsReady = false

const defaultConfig = { browsers: defaultBrowsers }
const userConfig = {}

const store = new Store({ defaults: defaultConfig })

const loadConfig = () => {
  return new Promise(fulfill => {
    userConfig['browsers'] = store.get('browsers')

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

const findInstalledBrowsers = () => {
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
      const installedBrowsers = installedApps
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

function createPickerWindow(installedBrowsers, callback) {
  // Create the browser window.
  pickerWindow = new BrowserWindow({
    width: 400,
    height: installedBrowsers.length * 64 + 48,
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

  pickerWindow.installedBrowsers = installedBrowsers

  // and load the index.html of the app.
  pickerWindow.loadURL(`file://${__dirname}/index.html`)

  // Menubar icon
  tray = new Tray(`${__dirname}/images/icon/tray_iconTemplate.png`)
  tray.setPressedImage(`${__dirname}/images/icon/tray_iconHighlight.png`)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Preferences',
      click: function() {
        createPreferencesWindow(installedBrowsers)
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
        app.quit()
      }
    }
  ])
  tray.setToolTip('Browserosaurus')
  tray.setContextMenu(contextMenu)

  pickerWindow.on('blur', () => {
    pickerWindow.webContents.send('close', true)
  })

  if (callback) {
    callback()
  }
}

const sendUrlToRenderer = url => {
  pickerWindow.center() // moves window to current screen
  pickerWindow.webContents.send('incomingURL', url)
}

/**
 * Create Preferences Window
 * @param {array} installedBrowsers
 */
function createPreferencesWindow(installedBrowsers) {
  if (!preferencesWindow) {
    preferencesWindow = new BrowserWindow({
      width: 400,
      height: installedBrowsers.length * 64 + 24,
      icon: `${__dirname}/images/icon/icon.png`,
      resizable: false
    })

    preferencesWindow.installedBrowsers = installedBrowsers
    preferencesWindow.loadURL(`file://${__dirname}/preferences.html`)
    // allow window to be opened again
    preferencesWindow.on('close', () => (preferencesWindow = null))
  } else {
    // Bring to front
    preferencesWindow.show()
  }
}

ipcMain.on('toggle-browser', (event, { browserName, enabled }) => {
  const browserIndex = userConfig.browsers.findIndex(
    browser => browser.name === browserName
  )

  userConfig.browsers[browserIndex].enabled = enabled

  store.set('browsers', userConfig.browsers)

  pickerWindow.reload()
})

app.on('ready', () => {
  // Prompt to set as default browser
  app.setAsDefaultProtocolClient('http')

  loadConfig().then(() =>
    findInstalledBrowsers().then(installedBrowsers => {
      createPickerWindow(installedBrowsers, () => {
        pickerWindow.once('ready-to-show', () => {
          // pickerWindow.webContents.send('installedBrowsers', installedBrowsers)
          if (global.URLToOpen) {
            sendUrlToRenderer(global.URLToOpen)
            global.URLToOpen = null
          }
          appIsReady = true
          // pickerWindow.webContents.openDevTools({ mode: 'detach' })
        })
      })
    })
  )
})

// Hide dock icon
app.dock.hide()

app.on('open-url', (event, url) => {
  event.preventDefault()
  if (appIsReady) {
    sendUrlToRenderer(url)
  } else {
    global.URLToOpen = url // this will be handled later in the createWindow callback
  }
})
