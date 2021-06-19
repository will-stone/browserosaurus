/* eslint-disable unicorn/prefer-regexp-test -- rtk uses .match */
import { AnyAction, Middleware } from '@reduxjs/toolkit'
import { execFile } from 'child_process'
import { app, autoUpdater } from 'electron'
import electronIsDev from 'electron-is-dev'
import xor from 'lodash/xor'
import sleep from 'tings/sleep'

import { apps } from '../../config/apps'
import {
  changedHotkey,
  clickedAlreadyDonated,
  clickedCopyButton,
  clickedDonate,
  clickedEyeButton,
  clickedFavButton,
  clickedMaybeLater,
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
  urlUpdated,
} from '../../shared/state/actions'
import type { RootState } from '../../shared/state/reducer.root'
import copyToClipboard from '../utils/copy-to-clipboard'
import { filterAppsByInstalled } from '../utils/filter-apps-by-installed'
import { getTheme } from '../utils/get-theme'
import { isUpdateAvailable } from '../utils/is-update-available'
import { bWindow, showBWindow } from '../windows'
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
    /**
     * Move to next middleware
     */
    // eslint-disable-next-line node/callback-return -- must flush to get nextState
    const result = next(action)

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
      bWindow?.hide()
    }

    // Quit
    else if (clickedQuitButton.match(action)) {
      app.quit()
    }

    // Reload
    else if (clickedReloadButton.match(action)) {
      bWindow?.reload()
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

    // Change fav
    else if (clickedFavButton.match(action)) {
      permaStore.set('fav', action.payload)
    }

    // Update hidden tiles
    else if (clickedEyeButton.match(action)) {
      permaStore.set(
        'hiddenTileIds',
        xor(permaStore.get('hiddenTileIds'), [action.payload]),
      )
    }

    // Update hotkeys
    else if (changedHotkey.match(action)) {
      permaStore.set('hotkeys', getState().storage.hotkeys)
    }

    // Open app
    else if (pressedAppKey.match(action) || clickedTile.match(action)) {
      const { appId, url = '', isAlt, isShift } = action.payload

      // Bail if app's bundle id is missing
      if (!appId) return

      const { urlTemplate, privateArg } = apps.find((b) => b.id === appId) || {}

      // Bail if app cannot be found in config (this, in theory, can't happen)
      if (!app) return

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

      bWindow?.hide()
    }

    // Escape key
    else if (pressedEscapeKey.match(action)) {
      bWindow?.hide()
    }

    // Donate button or maybe later buttons clicked
    else if (clickedDonate.match(action) || clickedMaybeLater.match(action)) {
      permaStore.set('supportMessage', Date.now())
    }

    // Already donated button clicked
    else if (clickedAlreadyDonated.match(action)) {
      permaStore.set('supportMessage', -1)
    }

    // Already donated button clicked
    else if (urlUpdated.match(action)) {
      if (getState().data.tilesStarted) {
        showBWindow()
      }
      // There appears to be some kind of race condition where the window is created
      // but not yet ready, so the sent URL on startup gets lost.
      else {
        await sleep(500)
        dispatch(urlUpdated(action.payload))
      }
    }

    return result
  }
