import { app, Menu, Tray } from 'electron'
import path from 'path'

import { clickedOpenPrefs, clickedRestorePicker } from './state/actions'
import { dispatch } from './state/store'

let tray: Tray | undefined

/**
 * Menubar icon
 */
export function createTray(): void {
  tray = new Tray(path.join(__dirname, '/static/icon/tray_iconTemplate.png'))

  tray.setPressedImage(
    path.join(__dirname, '/static/icon/tray_iconHighlight.png'),
  )

  tray.setToolTip('Browserosaurus')

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        click: () => dispatch(clickedRestorePicker()),
        label: 'Restore recently closed URL',
      },
      {
        type: 'separator',
      },
      {
        click: () => dispatch(clickedOpenPrefs()),
        label: 'Preferences...',
      },
      {
        type: 'separator',
      },
      {
        click: () => app.exit(),
        label: 'Quit',
      },
    ]),
  )
}
