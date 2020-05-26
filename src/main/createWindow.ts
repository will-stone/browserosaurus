import electron from 'electron'
import path from 'path'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// console.log(
//   'alternate-selected-control-text',
//   electron.systemPreferences.getColor('alternate-selected-control-text'),
// )
// console.log(
//   'control-background',
//   electron.systemPreferences.getColor('control-background'),
// )
// console.log('control', electron.systemPreferences.getColor('control'))
// console.log('control-text', electron.systemPreferences.getColor('control-text'))
// console.log(
//   'disabled-control-text',
//   electron.systemPreferences.getColor('disabled-control-text'),
// )
// console.log(
//   'find-highlight',
//   electron.systemPreferences.getColor('find-highlight'),
// )
// console.log('grid', electron.systemPreferences.getColor('grid'))
// console.log('header-text', electron.systemPreferences.getColor('header-text'))
// console.log('highlight', electron.systemPreferences.getColor('highlight'))
// console.log(
//   'keyboard-focus-indicator',
//   electron.systemPreferences.getColor('keyboard-focus-indicator'),
// )
// console.log('label', electron.systemPreferences.getColor('label'))
// console.log('link', electron.systemPreferences.getColor('link'))
// console.log(
//   'placeholder-text',
//   electron.systemPreferences.getColor('placeholder-text'),
// )
// console.log(
//   'quaternary-label',
//   electron.systemPreferences.getColor('quaternary-label'),
// )
// console.log(
//   'scrubber-textured-background',
//   electron.systemPreferences.getColor('scrubber-textured-background'),
// )
// console.log(
//   'secondary-label',
//   electron.systemPreferences.getColor('secondary-label'),
// )
// console.log(
//   'selected-content-background',
//   electron.systemPreferences.getColor('selected-content-background'),
// )
// console.log(
//   'selected-control',
//   electron.systemPreferences.getColor('selected-control'),
// )
// console.log(
//   'selected-control-text',
//   electron.systemPreferences.getColor('selected-control-text'),
// )
// console.log(
//   'selected-menu-item-text',
//   electron.systemPreferences.getColor('selected-menu-item-text'),
// )
// console.log(
//   'selected-text-background',
//   electron.systemPreferences.getColor('selected-text-background'),
// )
// console.log(
//   'selected-text',
//   electron.systemPreferences.getColor('selected-text'),
// )
// console.log('separator', electron.systemPreferences.getColor('separator'))
// console.log('shadow', electron.systemPreferences.getColor('shadow'))
// console.log(
//   'tertiary-label',
//   electron.systemPreferences.getColor('tertiary-label'),
// )
// console.log(
//   'text-background',
//   electron.systemPreferences.getColor('text-background'),
// )
// console.log('text', electron.systemPreferences.getColor('text'))
// console.log(
//   'under-page-background',
//   electron.systemPreferences.getColor('under-page-background'),
// )
// console.log(
//   'unemphasized-selected-content-background',
//   electron.systemPreferences.getColor(
//     'unemphasized-selected-content-background',
//   ),
// )
// console.log(
//   'unemphasized-selected-text-background',
//   electron.systemPreferences.getColor('unemphasized-selected-text-background'),
// )
// console.log(
//   'unemphasized-selected-text',
//   electron.systemPreferences.getColor('unemphasized-selected-text'),
// )
// console.log(
//   'window-background',
//   electron.systemPreferences.getColor('window-background'),
// )
// console.log(
//   'window-frame-text',
//   electron.systemPreferences.getColor('window-frame-text'),
// )

// console.log(electron.systemPreferences.getColor('shadow'))

function createWindow(): Promise<electron.BrowserWindow> {
  return new Promise((resolve, reject) => {
    const win = new electron.BrowserWindow({
      backgroundColor: '#1e1e1e',
      frame: true,
      icon: path.join(__dirname, '/static/icon/icon.png'),
      title: 'Browserosaurus',
      titleBarStyle: 'hidden',
      webPreferences: {
        additionalArguments: [],
        nodeIntegration: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
      height: 700,
      minHeight: 700,
      width: 800,
      minWidth: 800,
      show: false,
    })

    win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

    win.on('close', (event_) => {
      event_.preventDefault()
      win.hide()
    })

    win.once('ready-to-show', () => {
      win.show()
      // pickerWindow.webContents.openDevTools()
      resolve(win)
    })

    win.once('unresponsive', () => reject(new Error('Window did not load')))
  })
}

export default createWindow
