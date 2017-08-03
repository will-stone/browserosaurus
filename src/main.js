import electron, { app, BrowserWindow, Tray, Menu, protocol } from 'electron'
import jp from 'jsonpath'

import { spawn } from 'child_process'
import parser from 'xml2json'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let pickerWindow = null

let tray = null
let willQuitApp = false

const findInstalledBrowsers = () => {
  return new Promise((fulfill, reject) => {
    const sp = spawn('system_profiler', ['-xml', 'SPApplicationsDataType'])

    let profile = ''
    const browsers = [
      'Brave',
      'Chromium',
      'Firefox',
      'Google Chrome',
      'Maxthon',
      'Opera',
      'Safari',
      'SeaMonkey',
      'TorBrowser',
      'Vivaldi'
    ]

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
      const installedBrowsers = jp
        .query(profile, 'plist.array.dict.array[1].dict[*].string[0]')
        .filter(item => browsers.indexOf(item) > -1)
      fulfill(installedBrowsers)
    })
  })
}

function createPickerWindow(installedBrowsers) {
  // Create the browser window.
  pickerWindow = new BrowserWindow({
    width: 128,
    height: 64,
    acceptFirstMouse: true,
    alwaysOnTop: true,
    icon: `${__dirname}/images/icon/icon.png`,
    frame: false,
    resizable: false,
    movable: false,
    show: false,
    title: 'Browserosaurus',
    backgroundColor: '#111111'
  })

  // and load the index.html of the app.
  pickerWindow.loadURL(`file://${__dirname}/index.html`)

  pickerWindow.once('ready-to-show', () => {
    pickerWindow.webContents.send('installedBrowsers', installedBrowsers)
  })

  // Menubar icon
  tray = new Tray(`${__dirname}/images/icon/tray_iconTemplate.png`)
  tray.setPressedImage(`${__dirname}/images/icon/tray_iconHighlight.png`)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: function() {
        app.quit()
      }
    }
  ])
  tray.setToolTip('Browserosaurus')
  tray.setContextMenu(contextMenu)

  // Open the DevTools.
  // if (process.env.ENV === 'DEV') {
  //   pickerWindow.webContents.openDevTools({ mode: 'detach' })
  // }

  // Hide dock icon
  app.dock.hide()

  pickerWindow.on('blur', e => {
    pickerWindow.hide()
  })

  pickerWindow.on('close', e => {
    if (willQuitApp) {
      /* the user tried to quit the app */
      pickerWindow = null
    } else {
      /* the user only tried to close the window */
      e.preventDefault()
      pickerWindow.hide()
    }
  })
}

const showWindow = url => {
  if (pickerWindow && pickerWindow.webContents) {
    pickerWindow.webContents.send('incomingURL', url)
    const cursorScreenPoint = electron.screen.getCursorScreenPoint()
    pickerWindow.setPosition(cursorScreenPoint.x, cursorScreenPoint.y)
    pickerWindow.show()
  } else {
    setTimeout(() => showWindow(url), 200)
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  if (!pickerWindow) {
    findInstalledBrowsers().then(installedBrowsers => {
      createPickerWindow(installedBrowsers)

      app.on('open-url', (event, url) => {
        event.preventDefault()
        showWindow(url)
      })
    })
  }
})

// Prompt to set as default browser
// app.setAsDefaultProtocolClient('http')

/* 'before-quit' is emitted when Electron receives 
 * the signal to exit and wants to start closing windows */
app.on('before-quit', () => (willQuitApp = true))

// Quit when all windows are closed. Except on darwin.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q.
  // Exceptions include System Preferences, App Store,
  // Though there is no way to re-open the main window
  // through the menu, but you can click on the dock icon.
  // Noted in the README
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
