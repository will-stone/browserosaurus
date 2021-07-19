/* eslint-disable node/callback-return -- must flush middleware to get nextState*/
/* eslint-disable unicorn/prefer-regexp-test -- rtk uses .match */
import { AnyAction, Middleware } from '@reduxjs/toolkit'
import { execFile } from 'child_process'
import { app, autoUpdater, shell } from 'electron'
import electronIsDev from 'electron-is-dev'
import deepEqual from 'fast-deep-equal'
import path from 'path'
import sleep from 'tings/sleep'

import package_ from '../../../package.json'
import { apps } from '../../config/apps'
import { B_URL, ISSUES_URL } from '../../config/CONSTANTS'
import {
  appReady,
  clickedCopyButton,
  clickedHomepageButton,
  clickedOpenIssueButton,
  clickedRescanApps,
  clickedSetAsDefaultBrowserButton,
  clickedTile,
  clickedUpdateAvailableButton,
  clickedUpdateButton,
  clickedUpdateRestartButton,
  gotAppVersion,
  gotDefaultBrowserStatus,
  prefsStarted,
  pressedAppKey,
  pressedCopyKey,
  pressedEscapeKey,
  syncApps,
  syncData,
  syncStorage,
  tilesStarted,
  updateAvailable,
  updateDownloaded,
  updateDownloading,
  urlOpened,
} from '../../shared/state/actions'
import type { RootState } from '../../shared/state/reducer.root'
import { logger } from '../../shared/utils/logger'
import { storage } from '../storage'
import { createTray, tray } from '../tray'
import copyToClipboard from '../utils/copy-to-clipboard'
import { getUpdateUrl } from '../utils/get-update-url'
import { isUpdateAvailable } from '../utils/is-update-available'
import { createWindows, pWindow, showTWindow, tWindow } from '../windows'
import { checkForUpdate } from './thunk.check-for-update'
import { getApps } from './thunk.get-apps'

/**
 * Actions that need to be dealt with by main.
 */
export const actionHubMiddleware =
  (): Middleware<
    // Legacy type parameter added to satisfy interface signature
    Record<string, unknown>,
    RootState
  > =>
  ({ dispatch, getState }) =>
  (next) =>
  async (action: AnyAction) => {
    const previousState = getState()

    // Move to next middleware
    const result = next(action)

    const nextState = getState()

    /**
     * Update perma store on state.storage changes
     */
    if (!deepEqual(previousState.storage, nextState.storage)) {
      storage.setAll(nextState.storage)
    }

    // Main's process is ready
    if (appReady.match(action)) {
      // Hide from dock and cmd-tab
      app.dock.hide()

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
          tWindow?.destroy()
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

      // Send all info down to renderer
      dispatch(syncStorage(storage.getAll()))

      // App version
      dispatch(
        gotAppVersion(`${app.getVersion()}${electronIsDev ? ' DEV' : ''}`),
      )

      // Is default browser?
      dispatch(gotDefaultBrowserStatus(app.isDefaultProtocolClient('http')))

      // FIX casting when I know how to correctly type this dispatch to allow thunks
      dispatch(getApps() as unknown as AnyAction)
      createWindows()
      createTray()
      dispatch(checkForUpdate() as unknown as AnyAction)
    }

    // Both renderers started, send down all the data
    else if (
      getState().data.prefsStarted &&
      getState().data.tilesStarted &&
      (tilesStarted.match(action) || prefsStarted.match(action))
    ) {
      dispatch(syncApps(nextState.apps))
      dispatch(syncData(nextState.data))
      dispatch(syncStorage(nextState.storage))
    }

    // Copy to clipboard
    else if (clickedCopyButton.match(action) || pressedCopyKey.match(action)) {
      copyToClipboard(action.payload)
      tWindow?.hide()
    }

    // Set as default browser
    else if (clickedSetAsDefaultBrowserButton.match(action)) {
      app.setAsDefaultProtocolClient('http')
      app.setAsDefaultProtocolClient('https')
    }

    // Update and restart
    else if (updateAvailable.match(action)) {
      tray?.setImage(path.join(__dirname, '/static/icon/tray_iconBlue.png'))
    }

    // Update and restart
    else if (clickedUpdateButton.match(action)) {
      autoUpdater.checkForUpdates()
    }

    // Update and restart
    else if (clickedUpdateRestartButton.match(action)) {
      autoUpdater.quitAndInstall()
      // @ts-expect-error -- window must be destroyed to prevent race condition
      // eslint-disable-next-line unicorn/no-null
      pWindow = null
      // @ts-expect-error -- window must be destroyed to prevent race condition
      // eslint-disable-next-line unicorn/no-null
      tWindow = null
      // https://stackoverflow.com/questions/38309240/object-has-been-destroyed-when-open-secondary-child-window-in-electron-js
    }

    // Rescan for browsers
    else if (clickedRescanApps.match(action)) {
      // FIX casting when I know how to correctly type this dispatch to allow thunks
      dispatch(getApps() as unknown as AnyAction)
    }

    // Open app
    else if (pressedAppKey.match(action) || clickedTile.match(action)) {
      const { appId, url = '', isAlt, isShift } = action.payload

      // Bail if app's bundle id is missing
      if (!appId) return

      const { urlTemplate, privateArg } = apps.find((b) => b.id === appId) || {}

      const processedUrlTemplate = urlTemplate
        ? urlTemplate.replace(/\{\{URL\}\}/u, url)
        : url

      const openArguments: string[] = [
        '-b',
        appId,
        isAlt ? '--background' : [],
        isShift && privateArg ? ['--new', '--args', privateArg] : [],
        // In order for private/incognito mode to work the URL needs to be passed
        // in last, _after_ the respective app.privateArg flag
        processedUrlTemplate,
      ]
        .filter(Boolean)
        .flat()

      execFile('open', openArguments)

      tWindow?.hide()
    }

    // Escape key
    else if (pressedEscapeKey.match(action)) {
      tWindow?.hide()
    }

    // Open URL
    else if (urlOpened.match(action)) {
      if (nextState.data.tilesStarted) {
        showTWindow()
      }
      // There appears to be some kind of race condition where the window is created
      // but not yet ready, so the sent URL on startup gets lost.
      else {
        await sleep(500)
        dispatch(urlOpened(action.payload))
      }
    }

    // Open homepage
    else if (clickedHomepageButton.match(action)) {
      shell.openExternal(B_URL)
    }

    // Open homepage
    else if (clickedOpenIssueButton.match(action)) {
      shell.openExternal(ISSUES_URL)
    }

    // Open homepage
    else if (clickedUpdateAvailableButton.match(action)) {
      pWindow?.show()
    }

    return result
  }
