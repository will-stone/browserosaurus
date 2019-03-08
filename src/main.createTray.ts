import { app, Menu, MenuItemConstructorOptions, Tray } from 'electron'
import { ACTIVITIES_GET, SET_FAV } from './config/events'
import { Activity } from './model'
import eventEmitter from './utils/eventEmitter'

let tray = null

/**
 * Create Tray Icon
 *
 * Creates the menubar icon and menu items.
 */
function createTrayIcon(activities: Activity[]) {
  return new Promise(resolve => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Rescan For Browsers',
        click() {
          eventEmitter.emit(ACTIVITIES_GET)
        },
      },
      {
        label: 'Favourite',
        submenu: Menu.buildFromTemplate(activities.map(activity => ({
          checked: activity.fav,
          label: activity.name,
          type: 'radio',
          click() {
            eventEmitter.emit(SET_FAV, activity.name)
          },
        })) as MenuItemConstructorOptions[]),
      },
      {
        label: 'About',
        click() {
          app.showAboutPanel()
        },
      },
      {
        label: 'Quit',
        click() {
          app.exit()
        },
      },
    ])

    tray = new Tray(`${__dirname}/images/icon/tray_iconTemplate.png`)

    tray.setPressedImage(`${__dirname}/images/icon/tray_iconHighlight.png`)

    tray.setToolTip('Browserosaurus')

    tray.setContextMenu(contextMenu)

    resolve()
  })
}

export default createTrayIcon
