import { app, Tray, Menu } from 'electron'

import { PREFS_OPEN } from '../config/events'

import eventEmitter from './eventEmitter'

let tray = null

/**
 * Create Tray Icon
 *
 * Creates the menubar icon and menu items.
 * @returns {null}
 */
function createTrayIcon() {
  return new Promise((resolve, reject) => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Preferences',
        click: function() {
          eventEmitter.emit(PREFS_OPEN)
        }
      },
      {
        label: 'Quit',
        click: function() {
          app.exit()
        }
      }
    ])

    tray = new Tray(`${__dirname}/../images/icon/tray_iconTemplate.png`)

    tray.setPressedImage(`${__dirname}/../images/icon/tray_iconHighlight.png`)

    tray.setToolTip('Browserosaurus')

    tray.setContextMenu(contextMenu)

    resolve()
  })
}

export default createTrayIcon
