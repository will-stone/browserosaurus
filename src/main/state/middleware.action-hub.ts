/* eslint-disable node/callback-return -- must flush middleware to get nextState */
/* eslint-disable unicorn/prefer-regexp-test -- rtk uses .match */
import { app, autoUpdater, shell } from 'electron'
import deepEqual from 'fast-deep-equal'
import path from 'path'

import { B_URL, ISSUES_URL } from '../../config/CONSTANTS'
import {
  clickedApp,
  clickedUrlBar,
  pressedKey,
  startedPicker,
} from '../../renderers/picker/state/actions'
import {
  clickedHomepageButton,
  clickedOpenIssueButton,
  clickedRescanApps,
  clickedSetAsDefaultBrowserButton,
  clickedUpdateButton,
  clickedUpdateRestartButton,
  startedPrefs,
} from '../../renderers/prefs/state/actions'
import type { Middleware } from '../../shared/state/model'
import type { RootState } from '../../shared/state/reducer.root'
import { database } from '../database'
import { createTray, tray } from '../tray'
import copyUrlToClipboard from '../utils/copy-url-to-clipboard'
import { getInstalledAppIds } from '../utils/get-installed-app-ids'
import { initUpdateChecker } from '../utils/init-update-checker'
import { openApp } from '../utils/open-app'
import {
  createWindows,
  pickerWindow,
  prefsWindow,
  showPickerWindow,
  showPrefsWindow,
} from '../windows'
import {
  availableUpdate,
  clickedOpenPrefs,
  clickedRestorePicker,
  openedUrl,
  readiedApp,
  syncReducers,
} from './actions'

/**
 * Asynchronously update perma store on state.storage changes
 */
function updateDatabase(
  previousState: RootState,
  nextState: RootState,
): Promise<void> {
  return new Promise((resolve) => {
    if (!deepEqual(previousState.storage, nextState.storage)) {
      database.setAll(nextState.storage)
    }

    resolve()
  })
}

/**
 * Actions that need to be dealt with by main.
 */
export const actionHubMiddleware =
  (): Middleware =>
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    const previousState = getState()

    // Initial request to prompt to become default browser
    // Check must happen before reducer run, before firstRun set to false
    if (readiedApp.match(action) && !previousState.storage.isSetup) {
      app.setAsDefaultProtocolClient('http')
      app.setAsDefaultProtocolClient('https')
    }

    // Move to next middleware
    const result = next(action)

    const nextState = getState()

    updateDatabase(previousState, nextState)

    // Main's process is ready
    if (readiedApp.match(action)) {
      // Hide from dock and cmd-tab
      app.dock.hide()
      createWindows()
      createTray()
      initUpdateChecker()
    }

    // When a renderer starts, send down all the local store for synchronisation
    else if (startedPicker.match(action) || startedPrefs.match(action)) {
      dispatch(syncReducers(nextState))
    }

    // Clicked URL bar
    else if (clickedUrlBar.match(action)) {
      if (copyUrlToClipboard(nextState.data.url)) {
        pickerWindow?.hide()
      }
    }

    // Set as default browser
    else if (clickedSetAsDefaultBrowserButton.match(action)) {
      app.setAsDefaultProtocolClient('http')
      app.setAsDefaultProtocolClient('https')
    }

    // Update and restart
    else if (availableUpdate.match(action)) {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      prefsWindow = null
      // @ts-expect-error -- window must be destroyed to prevent race condition
      pickerWindow = null
      // https://stackoverflow.com/questions/38309240/object-has-been-destroyed-when-open-secondary-child-window-in-electron-js
    }

    // Rescan for browsers
    else if (clickedRescanApps.match(action)) {
      getInstalledAppIds()
    }

    // Clicked app
    else if (clickedApp.match(action)) {
      const { appId, isAlt, isShift } = action.payload

      // Ignore if app's bundle id is missing
      if (appId) {
        openApp(appId, nextState.data.url, isAlt, isShift)
        pickerWindow?.hide()
      }
    }

    // Pressed key in picker window
    else if (pressedKey.match(action)) {
      // Escape key
      if (action.payload.physicalKey === 'Escape') {
        pickerWindow?.hide()
      }
      // Copy key
      else if (action.payload.metaKey && action.payload.virtualKey === 'c') {
        if (copyUrlToClipboard(nextState.data.url)) {
          pickerWindow?.hide()
        }
      }
      // App hotkey
      else {
        const foundApp = nextState.storage.apps.find(
          (storedApp) => storedApp.hotCode === action.payload.physicalKey,
        )

        if (!action.payload.metaKey && foundApp) {
          openApp(
            foundApp.id,
            nextState.data.url,
            action.payload.altKey,
            action.payload.shiftKey,
          )
          pickerWindow?.hide()
        }
      }
    }

    // Open URL
    else if (openedUrl.match(action)) {
      showPickerWindow()

      if (nextState.data.installedApps.length === 0) {
        getInstalledAppIds()
      }
    }

    // Tray: restore picker
    else if (clickedRestorePicker.match(action)) {
      showPickerWindow()

      if (nextState.data.installedApps.length === 0) {
        getInstalledAppIds()
      }
    }

    // Tray: open prefs
    else if (clickedOpenPrefs.match(action)) {
      showPrefsWindow()

      if (nextState.data.installedApps.length === 0) {
        getInstalledAppIds()
      }
    }

    // Open homepage
    else if (clickedHomepageButton.match(action)) {
      shell.openExternal(B_URL)
    }

    // Open issues page
    else if (clickedOpenIssueButton.match(action)) {
      shell.openExternal(ISSUES_URL)
    }

    return result
  }
