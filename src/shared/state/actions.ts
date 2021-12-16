/* eslint-disable prefer-destructuring -- enums cannot be destructured */
import { createAction as cA } from '@reduxjs/toolkit'
import type { Rectangle } from 'electron/main'

import type { AppId } from '../../config/apps'
import { Channel } from './channels'
import type { Data, PrefsTab } from './reducer.data'
import type { Storage } from './reducer.storage'

const MAIN = Channel.MAIN
const PICKER = Channel.PICKER
const PREFS = Channel.PREFS

// -----------------------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------------------

const appReady = cA(`${MAIN}/appReady`)

const urlOpened = cA<string>(`${MAIN}/urlOpened`)
const pickerWindowBoundsChanged = cA<Rectangle>(
  `${MAIN}/pickerWinBoundsChanged`,
)

const installedAppsRetrieved = cA<AppId[]>(`${MAIN}/installedAppsRetrieved`)

const syncData = cA<Data>(`${MAIN}/syncData`)
const syncStorage = cA<Storage>(`${MAIN}/syncStorage`)

const gotAppVersion = cA<string>(`${MAIN}/gotAppVersion`)
const gotDefaultBrowserStatus = cA<boolean>(`${MAIN}/gotDefaultBrowserStatus`)

const updateAvailable = cA(`${MAIN}/updateAvailable`)
const updateDownloading = cA(`${MAIN}/updateDownloading`)
const updateDownloaded = cA(`${MAIN}/updateDownloaded`)

const clickedRestorePicker = cA(`${MAIN}/clickedRestorePicker`)
const clickedOpenPrefs = cA(`${MAIN}/clickedOpenPrefs`)

// -----------------------------------------------------------------------------
// PICKER
// -----------------------------------------------------------------------------

interface OpenAppArguments {
  url: string
  appId: AppId | undefined
  isAlt: boolean
  isShift: boolean
}

const pickerStarted = cA(`${PICKER}/started`)

const clickedApp = cA<OpenAppArguments>(`${PICKER}/clickedApp`)

const keydown = cA<{
  isAlt: boolean
  isCmd: boolean
  isShift: boolean
  code: string
  key: string
  keyCode: number
}>(`${PICKER}/keydown`)
const pressedEscapeKey = cA(`${PICKER}/escapeKey`)
const pressedBackspaceKey = cA(`${PICKER}/backspaceKey`)
const pressedCopyKey = cA<string>(`${PICKER}/copyKey`)
const pressedAppKey = cA<OpenAppArguments>(`${PICKER}/appKey`)

const clickedUrlBar = cA(`${PICKER}/clickedUrlBar`)

const clickedDonate = cA(`${PICKER}/clickedDonate`)
const clickedMaybeLater = cA(`${PICKER}/clickedMaybeLater`)

// -----------------------------------------------------------------------------
// PREFS
// -----------------------------------------------------------------------------

const prefsStarted = cA(`${PREFS}/started`)

const clickedTabButton = cA<PrefsTab>(`${PREFS}/clickedTabButton`)

const clickedSetAsDefaultBrowserButton = cA(
  `${PREFS}/clickedSetAsDefaultBrowserButton`,
)
const clickedRescanApps = cA(`${PREFS}/clickedRescanApps`)
const clickedUpdateButton = cA(`${PREFS}/clickedUpdateButton`)
const clickedUpdateRestartButton = cA(`${PREFS}/clickedUpdateRestartButton`)

const changedHotkey = cA<{ appId: AppId; value: string }>(
  `${PREFS}/changedHotkey`,
)

const clickedHomepageButton = cA(`${PREFS}/clickedHomepageButton`)
const clickedOpenIssueButton = cA(`${PREFS}/clickedOpenIssueButton`)

const reorderedApps = cA<{ sourceId: AppId; destinationId: AppId }>(
  `${PREFS}/reorderedApps`,
)

export {
  appReady,
  changedHotkey,
  clickedApp,
  clickedDonate,
  clickedHomepageButton,
  clickedMaybeLater,
  clickedOpenIssueButton,
  clickedOpenPrefs,
  clickedRescanApps,
  clickedRestorePicker,
  clickedSetAsDefaultBrowserButton,
  clickedTabButton,
  clickedUpdateButton,
  clickedUpdateRestartButton,
  clickedUrlBar,
  gotAppVersion,
  gotDefaultBrowserStatus,
  installedAppsRetrieved,
  keydown,
  pickerStarted,
  pickerWindowBoundsChanged,
  prefsStarted,
  pressedAppKey,
  pressedBackspaceKey,
  pressedCopyKey,
  pressedEscapeKey,
  reorderedApps,
  syncData,
  syncStorage,
  updateAvailable,
  updateDownloaded,
  updateDownloading,
  urlOpened,
}
