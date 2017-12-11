import { app, BrowserWindow, Tray, Menu } from 'electron'
import jp from 'jsonpath'
import { spawn } from 'child_process'
import parser from 'xml2json'
import openAboutWindow from 'about-window'
import memFs from 'mem-fs'
import editor from 'mem-fs-editor'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let pickerWindow = null
let tray = null
let appIsReady = false

let configFileName = '.config/browserosaurus.json'

let configDefault = {}
let configUser = {}

let version = app.getVersion()

const loadConfig = () => {
  return new Promise((fulfill, reject) => {
    var configPath = require('os').homedir() + '/' + configFileName
    var configLocalPath = './src/browserosaurus.json'

    var store = memFs.create()
    var fs = editor.create(store)

    var configUserFile = fs.read(configPath, {
      defaults: null
    })
    var configDefaultFile = fs.read(configLocalPath, {
      defaults: null
    })

    if (configUserFile === null) {
      configUserFile = configDefaultFile

      fs.copyTpl(configLocalPath, configPath, {
        version: '1.0.0'
      })

      fs.commit(() => {
        return true
      })
    }

    configDefault = JSON.parse(configDefaultFile)

    try {
      configUser = JSON.parse(configUserFile)
    } catch (e) {
      if (e instanceof SyntaxError) {
        configUser = configDefault
      } else {
        throw e
      }
    }

    var defBrowserFound
    var userBrowserFound

    // Create clone of the default browsers
    let browsersDefalts = configDefault.browsers.slice(0)

    configUser.browsers.map((userBrowser, userBrowserId) => {
      userBrowserFound = false

      browsersDefalts.map((defBrowser, defBrowserId) => {
        if (defBrowser.name == userBrowser.name) {
          browsersDefalts[defBrowserId] = false
          userBrowserFound = true
        }
      })

      if (userBrowserFound === false) {
        configUser.browsers[userBrowserId] = false
      }
    })

    configUser.browsers = configUser.browsers.concat(browsersDefalts)
    configUser.browsers = configUser.browsers.filter(x => x)

    fs.writeJSON(configPath, configUser)

    fs.commit(() => {
      return true
    })

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
          for (let i = 0; i < configUser.browsers.length; i++) {
            const browser = configUser.browsers[i]
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

function createPickerWindow(numberOfBrowsers, callback) {
  // Create the browser window.
  pickerWindow = new BrowserWindow({
    width: 400,
    height: numberOfBrowsers * 64 + 48,
    acceptFirstMouse: true,
    alwaysOnTop: true,
    icon: `${__dirname}/images/icon/icon.png`,
    frame: false,
    resizable: false,
    movable: false,
    show: false,
    title: 'Browserosaurus',
    transparent: true,
    hasShadow: false
  })

  // and load the index.html of the app.
  pickerWindow.loadURL(`file://${__dirname}/index.html`)

  // Menubar icon
  tray = new Tray(`${__dirname}/images/icon/tray_iconTemplate.png`)
  tray.setPressedImage(`${__dirname}/images/icon/tray_iconHighlight.png`)
  const contextMenu = Menu.buildFromTemplate([
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
    setTimeout(() => pickerWindow.hide(), 300)
  })

  if (callback) {
    callback()
  }
}

const sendUrlToRenderer = url => {
  pickerWindow.webContents.send('incomingURL', url)
  pickerWindow.center() // moves window to current screen
  pickerWindow.show()
  pickerWindow.webContents.send('open', true)
}

app.on('ready', () => {
  // Prompt to set as default browser
  app.setAsDefaultProtocolClient('http')

  loadConfig().then(() =>
    findInstalledBrowsers().then(installedBrowsers => {
      createPickerWindow(installedBrowsers.length, () => {
        pickerWindow.once('ready-to-show', () => {
          pickerWindow.webContents.send('installedBrowsers', installedBrowsers)
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
