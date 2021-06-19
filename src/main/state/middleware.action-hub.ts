/* eslint-disable node/callback-return -- must flush middleware to get nextState*/
/* eslint-disable unicorn/prefer-regexp-test -- rtk uses .match */
import { AnyAction, Middleware } from '@reduxjs/toolkit'
import { execFile } from 'child_process'
import { app, autoUpdater } from 'electron'
import electronIsDev from 'electron-is-dev'
import deepEqual from 'fast-deep-equal'
import sleep from 'tings/sleep'

import { apps } from '../../config/apps'
import {
  clickedCopyButton,
  clickedQuitButton,
  clickedReloadButton,
  clickedSetAsDefaultBrowserButton,
  clickedTile,
  clickedUpdateButton,
  clickedUpdateRestartButton,
  gotAppVersion,
  gotDefaultBrowserStatus,
  gotInstalledApps,
  gotStore,
  gotTheme,
  prefsStarted,
  pressedAppKey,
  pressedCopyKey,
  pressedEscapeKey,
  tilesStarted,
  updateAvailable,
  urlOpened,
} from '../../shared/state/actions'
import type { RootState } from '../../shared/state/reducer.root'
import copyToClipboard from '../utils/copy-to-clipboard'
import { filterAppsByInstalled } from '../utils/filter-apps-by-installed'
import { getTheme } from '../utils/get-theme'
import { isUpdateAvailable } from '../utils/is-update-available'
import { showTWindow, tWindow } from '../windows'
import { permaStore } from './perma-store'

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
      permaStore.set(nextState.storage)
    }

    // Both renderers started, send down all the data
    if (
      getState().data.prefsStarted &&
      getState().data.tilesStarted &&
      (tilesStarted.match(action) || prefsStarted.match(action))
    ) {
      const installedApps = await filterAppsByInstalled(apps)

      // Send all info down to renderer
      dispatch(gotTheme(getTheme()))
      // Spreading this fixes "A non-serializable value was detected in an action, in the path: `payload`" error
      dispatch(gotStore({ ...permaStore.store }))
      dispatch(gotInstalledApps(installedApps))
      dispatch(
        gotAppVersion(`${app.getVersion()}${electronIsDev ? ' DEV' : ''}`),
      )

      // Is default browser?
      dispatch(gotDefaultBrowserStatus(app.isDefaultProtocolClient('http')))

      if (!electronIsDev && (await isUpdateAvailable())) {
        dispatch(updateAvailable())
      }
    }

    // Copy to clipboard
    else if (clickedCopyButton.match(action) || pressedCopyKey.match(action)) {
      copyToClipboard(action.payload)
      tWindow?.hide()
    }

    // Quit
    else if (clickedQuitButton.match(action)) {
      app.quit()
    }

    // Reload
    else if (clickedReloadButton.match(action)) {
      tWindow?.reload()
    }

    // Set as default browser
    else if (clickedSetAsDefaultBrowserButton.match(action)) {
      app.setAsDefaultProtocolClient('http')
      app.setAsDefaultProtocolClient('https')
    }

    // Update and restart
    else if (clickedUpdateButton.match(action)) {
      autoUpdater.checkForUpdates()
    }

    // Update and restart
    else if (clickedUpdateRestartButton.match(action)) {
      autoUpdater.quitAndInstall()
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
      if (getState().data.tilesStarted) {
        showTWindow()
      }
      // There appears to be some kind of race condition where the window is created
      // but not yet ready, so the sent URL on startup gets lost.
      else {
        await sleep(500)
        dispatch(urlOpened(action.payload))
      }
    }

    return result
  }
