import { app, Menu, MenuItemConstructorOptions, Tray } from 'electron'
import { ACTIVITIES_GET, SET_FAVOURITE } from './config/events'
import { IActivity } from './model'
import eventEmitter from './utils/eventEmitter'

let tray = null

/**
 * Create Tray Icon
 *
 * Creates the menubar icon and menu items.
 */
function createTrayIcon(activities: IActivity[]) {
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
          checked: activity.favourite,
          label: activity.name,
          type: 'radio',
          click() {
            eventEmitter.emit(SET_FAVOURITE, activity.name)
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
