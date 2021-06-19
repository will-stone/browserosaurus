import { AnyAction } from '@reduxjs/toolkit'
import electron, { app, autoUpdater, Menu, nativeTheme, Tray } from 'electron'
import electronIsDev from 'electron-is-dev'
import path from 'path'

import package_ from '../../package.json'
import {
  gotTheme,
  updateAvailable,
  updateDownloaded,
  updateDownloading,
  urlOpened,
} from '../shared/state/actions'
import { Channel } from '../shared/state/channels'
import { logger } from '../shared/utils/logger'
import { permaStore } from './state/perma-store'
import { dispatch } from './state/store'
import { getTheme } from './utils/get-theme'
import { getUpdateUrl } from './utils/get-update-url'
import { isUpdateAvailable } from './utils/is-update-available'
import { bWindow, createWindows, pWindow, showBWindow } from './windows'

// Attempt to fix this bug: https://github.com/electron/electron/issues/20944
app.commandLine.appendArgument('--enable-features=Metal')

if (permaStore.get('firstRun')) {
  // Prompt to set as default browser
  app.setAsDefaultProtocolClient('http')
  app.setAsDefaultProtocolClient('https')
}

let tray: Tray | undefined

// TODO due to this issue: https://github.com/electron/electron/issues/18699
// this does not work as advertised. It will detect the change but getColor()
// doesn't fetch updated values. Hopefully this will work in time.
nativeTheme.on('updated', () => {
  dispatch(gotTheme(getTheme()))
})

app.on('ready', async () => {
  await createWindows()

  /**
   * Menubar icon
   */
  tray = new Tray(path.join(__dirname, '/static/icon/tray_iconTemplate.png'))

  tray.setPressedImage(
    path.join(__dirname, '/static/icon/tray_iconHighlight.png'),
  )

  tray.setToolTip('Browserosaurus')

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Restore recently closed URL',
        click: () => showBWindow(),
      },
      {
        type: 'separator',
      },
      {
        label: 'Preferences...',
        click: () => pWindow?.show(),
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

  permaStore.set('firstRun', false)

  // Auto update on production
  if (!electronIsDev) {
    autoUpdater.setFeedURL({
      url: getUpdateUrl(),
      headers: {
        'User-Agent': `${package_.name}/${package_.version} (darwin: ${process.arch})`,
      },
    })

    autoUpdater.on('before-quit-for-update', () => {
      // All windows must be closed before an update can be applied using "restart".
      bWindow?.destroy()
      pWindow?.destroy()
    })

    autoUpdater.on('update-available', () => {
      dispatch(updateDownloading())
    })

    autoUpdater.on('update-downloaded', () => {
      dispatch(updateDownloaded())
    })

    autoUpdater.on('error', () => {
      logger('AutoUpdater', 'An error has occurred')
    })

    // 1000 * 60 * 60 * 24
    const ONE_DAY_MS = 86_400_000
    // Check for updates every day. The first check is done on load: in the
    // action-hub.
    setInterval(async () => {
      if (await isUpdateAvailable()) {
        dispatch(updateAvailable())
      }
    }, ONE_DAY_MS)
  }

  // Hide from dock and cmd-tab
  app.dock.hide()
})

// App doesn't always close on ctrl-c in console, this fixes that
app.on('before-quit', () => app.exit())

app.on('open-url', (event, url) => {
  event.preventDefault()
  dispatch(urlOpened(url))
})

/**
 * Enter actions from renderer into main's store's queue
 */
electron.ipcMain.on(Channel.PREFS, (_, action: AnyAction) => dispatch(action))

/**
 * Enter actions from renderer into main's store's queue
 */
electron.ipcMain.on(Channel.TILES, (_, action: AnyAction) => dispatch(action))
