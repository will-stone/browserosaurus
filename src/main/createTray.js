import { app, Menu, Tray } from 'electron'
import { ACTIVITIES_GET, SET_FAVOURITE } from '../config/events'
import eventEmitter from '../utils/eventEmitter'

let tray = null

/**
 * Create Tray Icon
 *
 * Creates the menubar icon and menu items.
 * @returns {undefined}
 */
function createTrayIcon(activities, favourite) {
  return new Promise((resolve, reject) => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Rescan For Browsers',
        click: function() {
          eventEmitter.emit(ACTIVITIES_GET)
        },
      },
      {
        label: 'Favourite',
        submenu: Menu.buildFromTemplate(
          activities.map(activity => ({
            label: activity.name,
            type: 'radio',
            checked: activity.name === favourite,
            click: function() {
              eventEmitter.emit(SET_FAVOURITE, activity.name)
            },
          })),
        ),
      },
      {
        label: 'Quit',
        click: function() {
          app.exit()
        },
      },
    ])

    tray = new Tray(`${__dirname}/../images/icon/tray_iconTemplate.png`)

    tray.setPressedImage(`${__dirname}/../images/icon/tray_iconHighlight.png`)

    tray.setToolTip('Browserosaurus')

    tray.setContextMenu(contextMenu)

    resolve()
  })
}

export default createTrayIcon
