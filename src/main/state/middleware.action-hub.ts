/* eslint-disable node/callback-return -- must flush middleware to get nextState */
/* eslint-disable unicorn/prefer-regexp-test -- rtk uses .match */
import { execFile } from 'child_process'
import { app, autoUpdater, Notification, shell } from 'electron'
import deepEqual from 'fast-deep-equal'
import path from 'path'

import { apps } from '../../config/apps'
import { B_URL, ISSUES_URL } from '../../config/CONSTANTS'
import {
  clickedApp,
  clickedUrlBar,
  pressedAppKey,
  pressedCopyKey,
  pressedEscapeKey,
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
import copyToClipboard from '../utils/copy-to-clipboard'
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
import { getInstalledAppIds } from './mid.get-installed-app-ids'
import { initUpdateChecker } from './mid.init-update-checker'

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

    // Copy to clipboard
    else if (clickedUrlBar.match(action) || pressedCopyKey.match(action)) {
      if (nextState.data.url) {
        copyToClipboard(nextState.data.url)
        pickerWindow?.hide()
        new Notification({
          title: 'Browserosaurus',
          body: 'URL copied to clipboard',
          silent: true,
        }).show()
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

    // Open app
    else if (pressedAppKey.match(action) || clickedApp.match(action)) {
      const { appId, url = '', isAlt, isShift } = action.payload

      // Bail if app's bundle id is missing
      if (!appId) return result

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

      pickerWindow?.hide()
    }

    // Escape key
    else if (pressedEscapeKey.match(action)) {
      pickerWindow?.hide()
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
