import { app, BrowserWindow, Tray, Menu } from 'electron'
import jp from 'jsonpath'
import { spawn } from 'child_process'
import parser from 'xml2json'
import openAboutWindow from 'about-window'

// import browsers from './browsers'

import memFs from 'mem-fs'
import editor from 'mem-fs-editor'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let pickerWindow = null
let tray = null
let appIsReady = false

let configFileName = 'browserosaurus.json'

var browsers = {}
var config = {}
var version = app.getVersion()

const loadConfig = () => {
	return new Promise((fulfill, reject) => {

    var notifications = []

		var configPath = require('os').homedir() + '/' + configFileName
		var configLocalPath = './src/browserosaurus.json'

		var store = memFs.create();
		var fs = editor.create(store);

		var configUser = fs.read(configPath, {
			'defaults': null
		})
		var configDefault = fs.read(configLocalPath, {
			'defaults': null
		})

		if (configUser === null) {

      configUser = configDefault

			fs.copyTpl(configLocalPath, configPath, {
				version: "1.0.0"
			})

      fs.commit(() => {
  			return true
  		})
		}

		try {
			var configUserObject = JSON.parse(configUser)
		} catch (e) {
			if (e instanceof SyntaxError) {
        notifications.push({type: "error", msg: "Nothing works"})
			} else {
				throw e
			}
		}

    if (configUserObject.version !== version && configUserObject.version !== "<%= version %>") {
      notifications.push({type: "warning", msg: "Please update you configuraton file"})
    }

    if (configUserObject.settings.configMode == "override") {
      browsers = configUserObject.browsers
    } else if (configUserObject.settings.configMode == "merge") {
      browsers = mergeConfigs(configUserObject, JSON.parse(configDefault))
    }

		fulfill(notifications)

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
			profile = parser.toJson(profile, {
				object: true
			})
			const installedApps = jp.query(
				profile,
				'plist.array.dict.array[1].dict[*].string[0]'
			)
			const installedBrowsers = installedApps
				.map(appName => {
					for (let i = 0; i < browsers.length; i++) {
						const browser = browsers[i]
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

function mergeConfigs(localConfig, userConfig) {

	return userConfig

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
	const contextMenu = Menu.buildFromTemplate([{
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

	loadConfig().then(() => findInstalledBrowsers().then(installedBrowsers => {
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
	}))
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
