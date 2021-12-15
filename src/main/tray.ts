import { app, Menu, Tray } from 'electron'
import path from 'path'

import { clickedOpenPrefs, clickedRestorePicker } from '../shared/state/actions'
import { dispatch } from './state/store'

export let tray: Tray | undefined

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
        label: 'Restore recently closed URL',
        click: () => dispatch(clickedRestorePicker()),
      },
      {
        type: 'separator',
      },
      {
        label: 'Preferences...',
        click: () => dispatch(clickedOpenPrefs()),
      },
      {
        type: 'separator',
      },
      {
        label: 'Quit',
        click: () => app.exit(),
      },
    ]),
  )
}
