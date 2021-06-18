import { AnyAction } from '@reduxjs/toolkit'
import electron from 'electron'
import electronIsDev from 'electron-is-dev'
import path from 'path'
import sleep from 'tings/sleep'

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
import { getUpdateUrl } from './get-update-url'
import { getTheme } from './getTheme'
import { isUpdateAvailable } from './is-update-available'
import { permaStore } from './perma-store'
import { dispatch } from './store'
import { bWindow, createWindows, pWindow } from './windows'

declare const TILES_WINDOW_WEBPACK_ENTRY: string
declare const PREFS_WINDOW_WEBPACK_ENTRY: string

// Attempt to fix this bug: https://github.com/electron/electron/issues/20944
electron.app.commandLine.appendArgument('--enable-features=Metal')

if (permaStore.get('firstRun')) {
  // Prompt to set as default browser
  electron.app.setAsDefaultProtocolClient('http')
  electron.app.setAsDefaultProtocolClient('https')
}

// There appears to be some kind of race condition where the window is created
// but not yet ready, so the sent URL on startup gets lost. This tracks the
// ready-to-show event.
let bWindowIsReadyToShow = false
let tray: electron.Tray | undefined

// TODO due to this issue: https://github.com/electron/electron/issues/18699
// this does not work as advertised. It will detect the change but getColor()
// doesn't fetch updated values. Hopefully this will work in time.
electron.nativeTheme.on('updated', () => {
  dispatch(gotTheme(getTheme()))
})

function showBWindow() {
  if (bWindow) {
    const displayBounds = electron.screen.getDisplayNearestPoint(
      electron.screen.getCursorScreenPoint(),
    ).bounds

    const displayEnd = {
      x: displayBounds.x + displayBounds.width,
      y: displayBounds.y + displayBounds.height,
    }

    const mousePoint = electron.screen.getCursorScreenPoint()

    const bWindowBounds = bWindow.getBounds()

    const bWindowEdges = {
      right: mousePoint.x + bWindowBounds.width,
      bottom: mousePoint.y + bWindowBounds.height,
    }

    const nudge = {
      x: 50,
      y: 10,
    }

    const inWindowPosition = {
      x:
        bWindowEdges.right > displayEnd.x + nudge.x
          ? displayEnd.x - bWindowBounds.width
          : mousePoint.x - nudge.x,
      y:
        bWindowEdges.bottom > displayEnd.y + nudge.y
          ? displayEnd.y - bWindowBounds.height
          : mousePoint.y + nudge.y,
    }

    bWindow.setPosition(inWindowPosition.x, inWindowPosition.y, false)

    bWindow.show()
  }
}

electron.app.on('ready', async () => {
  createWindows()

  await pWindow?.loadURL(PREFS_WINDOW_WEBPACK_ENTRY)

  pWindow?.on('close', (event_) => {
    event_.preventDefault()
    pWindow?.hide()
  })

  bWindow?.setWindowButtonVisibility(false)

  await bWindow?.loadURL(TILES_WINDOW_WEBPACK_ENTRY)

  bWindow?.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  bWindow?.on('ready-to-show', () => {
    bWindowIsReadyToShow = true
  })

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
    dispatch(
      gotDefaultBrowserStatus(electron.app.isDefaultProtocolClient('http')),
    )
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
  tray = new electron.Tray(
    path.join(__dirname, '/static/icon/tray_iconTemplate.png'),
  )

  tray.setPressedImage(
    path.join(__dirname, '/static/icon/tray_iconHighlight.png'),
  )

  tray.setToolTip('Browserosaurus')

  tray.setContextMenu(
    electron.Menu.buildFromTemplate([
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
        click: () => electron.app.exit(),
      },
    ]),
  )

  permaStore.set('firstRun', false)

  // Auto update on production
  if (!electronIsDev) {
    electron.autoUpdater.setFeedURL({
      url: getUpdateUrl(),
      headers: {
        'User-Agent': `${package_.name}/${package_.version} (darwin: ${process.arch})`,
      },
    })

    electron.autoUpdater.on('before-quit-for-update', () => {
      // All windows must be closed before an update can be applied using "restart".
      bWindow?.destroy()
    })

    electron.autoUpdater.on('update-available', () => {
      dispatch(updateDownloading())
    })

    electron.autoUpdater.on('update-downloaded', () => {
      dispatch(updateDownloaded())
    })

    electron.autoUpdater.on('error', () => {
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
  electron.app.dock.hide()
})

// App doesn't always close on ctrl-c in console, this fixes that
electron.app.on('before-quit', () => {
  electron.app.exit()
})

async function sendUrl(url: string) {
  if (bWindow && bWindowIsReadyToShow) {
    dispatch(urlUpdated(url))
    showBWindow()
  } else {
    await sleep(500)
    sendUrl(url)
  }
}

electron.app.on('open-url', (event, url) => {
  event.preventDefault()
  sendUrl(url)
})

electron.ipcMain.on(Channel.PREFS, (_, action: AnyAction) => {
  dispatch(action)
})

electron.ipcMain.on(Channel.TILES, (_, action: AnyAction) => {
  dispatch(action)
})
