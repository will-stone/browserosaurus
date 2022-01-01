/* eslint-disable node/callback-return -- must flush middleware to get nextState */
/* eslint-disable unicorn/prefer-regexp-test -- rtk uses .match */
import { execFile } from 'child_process'
import { app, autoUpdater, Notification, shell } from 'electron'
import deepEqual from 'fast-deep-equal'
import path from 'path'

import package_ from '../../../package.json'
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
import { logger } from '../../shared/utils/logger'
import { database } from '../database'
import { createTray, tray } from '../tray'
import copyToClipboard from '../utils/copy-to-clipboard'
import { getUpdateUrl } from '../utils/get-update-url'
import { isUpdateAvailable } from '../utils/is-update-available'
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
  downloadedUpdate,
  downloadingUpdate,
  openedUrl,
  readiedApp,
  syncReducers,
} from './actions'
import { checkForUpdate } from './thunk.check-for-update'
import { getInstalledAppIds } from './thunk.get-installed-app-ids'

/**
 * Asynchronously update perma store on state.storage changes
 */
const updateDatabase = (
  previousState: RootState,
  nextState: RootState,
): Promise<void> =>
  new Promise((resolve) => {
    if (!deepEqual(previousState.storage, nextState.storage)) {
      database.setAll(nextState.storage)
    }

    resolve()
  })

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
    if (readiedApp.match(action) && previousState.storage.firstRun !== false) {
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
          pickerWindow?.destroy()
          prefsWindow?.destroy()
        })

        autoUpdater.on('update-available', () => {
          dispatch(downloadingUpdate())
        })

        autoUpdater.on('update-downloaded', () => {
          dispatch(downloadedUpdate())
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
            dispatch(availableUpdate())
          }
        }, ONE_DAY_MS)
      }

      createWindows()
      createTray()

      dispatch(checkForUpdate())
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
      prefsWindow = null
      // @ts-expect-error -- window must be destroyed to prevent race condition
      pickerWindow = null
      // https://stackoverflow.com/questions/38309240/object-has-been-destroyed-when-open-secondary-child-window-in-electron-js
    }

    // Rescan for browsers
    else if (clickedRescanApps.match(action)) {
      dispatch(getInstalledAppIds())
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
        dispatch(getInstalledAppIds())
      }
    }

    // Tray: restore picker
    else if (clickedRestorePicker.match(action)) {
      showPickerWindow()

      if (nextState.data.installedApps.length === 0) {
        dispatch(getInstalledAppIds())
      }
    }

    // Tray: open prefs
    else if (clickedOpenPrefs.match(action)) {
      showPrefsWindow()

      if (nextState.data.installedApps.length === 0) {
        dispatch(getInstalledAppIds())
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
