import electron, { app, BrowserWindow, Tray, Menu, protocol } from 'electron'
import jp from 'jsonpath'

import { spawn } from 'child_process'
import parser from 'xml2json'

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
})

sp.on('close', code => {
  console.log(`child process exited with code ${code}`)
})

sp.stdout.on('end', function() {
  profile = parser.toJson(profile, { object: true })
  const installedBrowsers = jp
    .query(profile, 'plist.array.dict.array[1].dict[*].string[0]')
    .filter(item => browsers.indexOf(item) > -1)
  console.log(installedBrowsers)
  console.log('Finished collecting data chunks.')
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let tray = null
let willQuitApp = false

function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 200,
    height: 50,
    acceptFirstMouse: true,
    alwaysOnTop: true,
    // backgroundColor: '#191917',
    icon: `${__dirname}/images/icon/icon.png`,
    frame: false,
    resizable: false,
    movable: false,
    transparent: true,
    show: false,
    title: 'Browserosaurus'
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // mainWindow.url = incomingURL

  // mainWindow.once('ready-to-show', () => {
  //   mainWindow.show()
  // })

  // Menubar icon
  // tray = new Tray(path.join(__dirname, 'images/icon/tray_iconTemplate.png'))
  // tray.setPressedImage(
  //   path.join(__dirname, 'images/icon/tray_iconHighlight.png')
  // )
  // const contextMenu = Menu.buildFromTemplate([
  //   {
  //     label: 'Quit',
  //     click: function() {
  //       app.quit()
  //     }
  //   }
  // ])
  // tray.setToolTip('Browserosaurus')
  // tray.setContextMenu(contextMenu)

  // Open the DevTools.
  // if (process.env.ENV === 'DEV') {
  //   mainWindow.webContents.openDevTools({ mode: 'detach' })
  // }

  mainWindow.on('blur', e => {
    mainWindow.hide()
  })

  mainWindow.on('close', e => {
    if (willQuitApp) {
      /* the user tried to quit the app */
      mainWindow = null
    } else {
      /* the user only tried to close the window */
      e.preventDefault()
      mainWindow.hide()
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  if (!mainWindow) {
    createMainWindow()
  }
})

app.setAsDefaultProtocolClient('http')

app.on('open-url', (event, url) => {
  event.preventDefault()
  mainWindow.webContents.send('incomingURL', url)
  const cursorScreenPoint = electron.screen.getCursorScreenPoint()
  mainWindow.setPosition(cursorScreenPoint.x, cursorScreenPoint.y)
  mainWindow.show()
})

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
