/* eslint-disable node/callback-return -- must flush middleware to get nextState */
/* eslint-disable unicorn/prefer-regexp-test -- rtk uses .match */
import type { AnyAction, Middleware } from '@reduxjs/toolkit'
import { execFile } from 'child_process'
import { app, autoUpdater, shell } from 'electron'
import deepEqual from 'fast-deep-equal'
import path from 'path'

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
  syncAppIds,
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
import { getInstalledAppIds } from './thunk.get-installed-app-ids'

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
  (action: AnyAction) => {
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
      if (app.isPackaged) {
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

      // Sync all storage with store
      dispatch(syncStorage(storage.getAll()))

      // App version
      dispatch(
        gotAppVersion(`${app.getVersion()}${app.isPackaged ? '' : ' DEV'}`),
      )

      // Is default browser?
      dispatch(gotDefaultBrowserStatus(app.isDefaultProtocolClient('http')))

      // FIX casting when I know how to correctly type this dispatch to allow thunks
      dispatch(getInstalledAppIds() as unknown as AnyAction)
      createWindows()
      createTray()
      dispatch(checkForUpdate() as unknown as AnyAction)
    }

    // When a renderer starts, send down all the local store for synchonisation
    else if (tilesStarted.match(action) || prefsStarted.match(action)) {
      dispatch(syncAppIds(nextState.appIds))
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
      pWindow = null
      // @ts-expect-error -- window must be destroyed to prevent race condition
      tWindow = null
      // https://stackoverflow.com/questions/38309240/object-has-been-destroyed-when-open-secondary-child-window-in-electron-js
    }

    // Rescan for browsers
    else if (clickedRescanApps.match(action)) {
      // FIX casting when I know how to correctly type this dispatch to allow thunks
      dispatch(getInstalledAppIds() as unknown as AnyAction)
    }

    // Open app
    else if (pressedAppKey.match(action) || clickedTile.match(action)) {
      const { appId, url = '', isAlt, isShift } = action.payload

      // Bail if app's bundle id is missing
      if (!appId) return

      const selectedApp = apps[appId]

      const processedUrlTemplate =
        'urlTemplate' in selectedApp
          ? selectedApp.urlTemplate.replace(/\{\{URL\}\}/u, url)
          : url

      const openArguments: string[] = [
        '-b',
        appId,
        isAlt ? '--background' : [],
        isShift && 'privateArg' in selectedApp
          ? ['--new', '--args', selectedApp.privateArg]
          : [],
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
      showTWindow()
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
