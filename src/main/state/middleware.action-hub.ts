/* eslint-disable n/callback-return -- must flush middleware to get nextState */
/* eslint-disable unicorn/prefer-regexp-test -- rtk uses .match */
import type { UnknownAction } from '@reduxjs/toolkit'
import { app, autoUpdater, globalShortcut, shell } from 'electron'
import deepEqual from 'fast-deep-equal'

import { B_URL, ISSUES_URL } from '../../config/constants.js'
import {
  clickedApp,
  clickedUpdateBar,
  clickedUrlBar,
  pressedKey,
  startedPicker,
} from '../../renderers/picker/state/actions.js'
import {
  clickedHomepageButton,
  clickedOpenIssueButton,
  clickedRescanApps,
  clickedSetAsDefaultBrowserButton,
  clickedUpdateButton,
  clickedUpdateRestartButton,
  confirmedReset,
  startedPrefs,
  toggledGlobalShortcut,
} from '../../renderers/prefs/state/actions.js'
import type { Middleware } from '../../shared/state/model.js'
import type { RootState } from '../../shared/state/reducer.root.js'
import { database } from '../database.js'
import { createTray } from '../tray.js'
import copyUrlToClipboard from '../utils/copy-url-to-clipboard.js'
import { getAppIcons } from '../utils/get-app-icons.js'
import { getInstalledAppNames } from '../utils/get-installed-app-names.js'
import { initUpdateChecker } from '../utils/init-update-checker.js'
import { openApp } from '../utils/open-app.js'
// import { removeWindowsFromMemory } from '../utils/remove-windows-from-memory'
import {
  createWindows,
  pickerWindow,
  prefsWindow,
  showPickerWindow,
  showPrefsWindow,
} from '../windows.js'
import {
  clickedOpenPrefs,
  clickedRestorePicker,
  openedUrl,
  readiedApp,
  receivedRendererStartupSignal,
  retrievedInstalledApps,
} from './actions.js'

/**
 * Global shortcut management
 */
const SHORTCUT_KEY = 'CommandOrControl+Shift+Y'

function registerGlobalShortcut(dispatch: (action: UnknownAction) => void): boolean {
  try {
    const registered = globalShortcut.register(SHORTCUT_KEY, () => {
      dispatch(clickedRestorePicker())
    })

    return registered
  } catch {
    return false
  }
}

function unregisterGlobalShortcut(): boolean {
  try {
    globalShortcut.unregister(SHORTCUT_KEY)
    return true
  } catch {
    return false
  }
}

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
    // Check must happen before reducer run, before isSetup set to false
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
      getInstalledAppNames()
      if (nextState.storage.globalShortcutEnabled) {
        registerGlobalShortcut(dispatch)
      }
    }

    // When a renderer starts, send down all the locally stored data
    // for reducer synchronisation.
    else if (startedPicker.match(action) || startedPrefs.match(action)) {
      dispatch(receivedRendererStartupSignal(nextState))
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
    else if (clickedUpdateButton.match(action)) {
      autoUpdater.checkForUpdates()
    }

    // Update and restart
    else if (clickedUpdateRestartButton.match(action)) {
      autoUpdater.quitAndInstall()
      // removeWindowsFromMemory()
    }

    // Rescan for browsers
    else if (clickedRescanApps.match(action)) {
      getInstalledAppNames()
    }

    // Clicked app
    else if (clickedApp.match(action)) {
      const { appName, isAlt, isShift } = action.payload

      // Ignore if app's bundle id is missing
      if (appName) {
        openApp(appName, nextState.data.url, isAlt, isShift)
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
            foundApp.name,
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
    }

    // Tray: restore picker
    else if (clickedRestorePicker.match(action)) {
      showPickerWindow()
    }

    // Tray: open prefs
    else if (clickedOpenPrefs.match(action)) {
      showPrefsWindow()
    }

    // Open prefs on click update bar
    else if (clickedUpdateBar.match(action)) {
      pickerWindow?.hide()
      showPrefsWindow()
    }

    // Open homepage
    else if (clickedHomepageButton.match(action)) {
      shell.openExternal(B_URL)
    }

    // Open issues page
    else if (clickedOpenIssueButton.match(action)) {
      shell.openExternal(ISSUES_URL)
    }

    // Factory reset
    else if (confirmedReset.match(action)) {
      if (process.env.NODE_ENV === 'development') {
        prefsWindow?.hide()
      } else {
        // removeWindowsFromMemory()
        app.relaunch()
        app.exit()
      }
    }

    // Get app icons
    else if (retrievedInstalledApps.match(action)) {
      getAppIcons(nextState.storage.apps)
    }

    // Toggle global shortcut
    else if (toggledGlobalShortcut.match(action)) {
      if (nextState.storage.globalShortcutEnabled) {
        registerGlobalShortcut(dispatch)
      } else {
        unregisterGlobalShortcut()
      }
    }

    return result
  }
