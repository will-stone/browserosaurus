import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { app, Menu, Tray } from 'electron'

import { clickedOpenPrefs, clickedRestorePicker } from './state/actions'
import { dispatch } from './state/store'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let tray: Tray | undefined

/**
 * Menubar icon
 */
export function createTray(): void {
  tray = new Tray(path.join(__dirname, '/icon/tray_iconTemplate.png'))

  tray.setPressedImage(path.join(__dirname, '/icon/tray_iconHighlight.png'))

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
