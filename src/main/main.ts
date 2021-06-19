import { AnyAction } from '@reduxjs/toolkit'
import electron, { app, autoUpdater, Menu, nativeTheme, Tray } from 'electron'
import electronIsDev from 'electron-is-dev'
import path from 'path'

import package_ from '../../package.json'
import {
  gotDefaultBrowserStatus,
  gotTheme,
  updateAvailable,
  updateDownloaded,
  updateDownloading,
  urlUpdated,
} from '../shared-state/actions'
import { Channel } from '../shared-state/channels'
import { logger } from '../utils/logger'
import { getTheme } from './get-theme'
import { getUpdateUrl } from './get-update-url'
import { isUpdateAvailable } from './is-update-available'
import { permaStore } from './perma-store'
import { dispatch } from './store'
import { bWindow, createWindows, pWindow, showBWindow } from './windows'

declare const TILES_WINDOW_WEBPACK_ENTRY: string
declare const PREFS_WINDOW_WEBPACK_ENTRY: string

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
  createWindows()

  await pWindow?.loadURL(PREFS_WINDOW_WEBPACK_ENTRY)

  pWindow?.on('close', (event_) => {
    event_.preventDefault()
    pWindow?.hide()
  })

  bWindow?.setWindowButtonVisibility(false)

  await bWindow?.loadURL(TILES_WINDOW_WEBPACK_ENTRY)

  bWindow?.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  bWindow?.on('hide', () => {
    bWindow?.hide()
  })

  bWindow?.on('close', (event_) => {
    event_.preventDefault()
    bWindow?.hide()
  })

  bWindow?.on('show', () => {
    // There isn't a listener for default protocol client, therefore the check
    // is made each time the app is brought into focus.
    dispatch(gotDefaultBrowserStatus(app.isDefaultProtocolClient('http')))
  })

  bWindow?.on('resize', () => {
    permaStore.set('bounds', bWindow?.getBounds())
  })

  bWindow?.on('blur', () => {
    bWindow?.hide()
  })

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
    // RENDERER_LOADED listener.
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
app.on('before-quit', () => {
  app.exit()
})

app.on('open-url', (event, url) => {
  event.preventDefault()
  dispatch(urlUpdated(url))
})

/**
 * Enter actions from renderer into main's store's queue
 */
electron.ipcMain.on(Channel.PREFS, (_, action: AnyAction) => {
  dispatch(action)
})

/**
 * Enter actions from renderer into main's store's queue
 */
electron.ipcMain.on(Channel.TILES, (_, action: AnyAction) => {
  dispatch(action)
})
