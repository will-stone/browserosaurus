/* eslint-disable prefer-destructuring -- enums cannot be destructured */
import { createAction as cA } from '@reduxjs/toolkit'
import type { Rectangle } from 'electron/main'

import { Channel } from './channels'
import type { App } from './reducer.apps'
import { Data, PrefsTab } from './reducer.data'
import type { Storage } from './reducer.storage'

const MAIN = Channel.MAIN
const TILES = Channel.TILES
const PREFS = Channel.PREFS

// -----------------------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------------------

const appReady = cA(`${MAIN}/appReady`)

const urlOpened = cA<string>(`${MAIN}/urlOpened`)
const tWindowBoundsChanged = cA<Rectangle>(`${MAIN}/tWindowBoundsChanged`)
const syncApps = cA<App[]>(`${MAIN}/syncApps`)
const syncData = cA<Data>(`${MAIN}/syncData`)
const syncStorage = cA<Storage>(`${MAIN}/syncStorage`)

const gotAppVersion = cA<string>(`${MAIN}/gotAppVersion`)
const gotDefaultBrowserStatus = cA<boolean>(`${MAIN}/gotDefaultBrowserStatus`)

const updateAvailable = cA(`${MAIN}/updateAvailable`)
const updateDownloading = cA(`${MAIN}/updateDownloading`)
const updateDownloaded = cA(`${MAIN}/updateDownloaded`)

// -----------------------------------------------------------------------------
// TILES
// -----------------------------------------------------------------------------

interface OpenAppArguments {
  url: string
  appId: App['id'] | undefined
  isAlt: boolean
  isShift: boolean
}

const tilesStarted = cA(`${TILES}/started`)

const clickedTile = cA<OpenAppArguments>(`${TILES}/clickTile`)

const keydown = cA<{
  isAlt: boolean
  isCmd: boolean
  isShift: boolean
  code: string
  key: string
  keyCode: number
}>(`${TILES}/keydown`)
const pressedEscapeKey = cA(`${TILES}/escapeKey`)
const pressedBackspaceKey = cA(`${TILES}/backspaceKey`)
const pressedCopyKey = cA<string>(`${TILES}/copyKey`)
const pressedAppKey = cA<OpenAppArguments>(`${TILES}/appKey`)

const clickedUrlBackspaceButton = cA(`${TILES}/clickedUrlBackspaceButton`)
const clickedCopyButton = cA<string>(`${TILES}/clickedCopyButton`)
const clickedUpdateAvailableButton = cA(`${TILES}/clickedUpdateAvailableButton`)

const clickedDonate = cA(`${TILES}/clickedDonate`)
const clickedMaybeLater = cA(`${TILES}/clickedMaybeLater`)

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

const clickedFavButton = cA<string>(`${PREFS}/clickedFavButton`)
const clickedEyeButton = cA<string>(`${PREFS}/clickedEyeButton`)
const changedHotkey = cA<{ appId: string; value: string }>(
  `${PREFS}/changedHotkey`,
)

const clickedHomepageButton = cA(`${PREFS}/clickedHomepageButton`)
const clickedOpenIssueButton = cA(`${PREFS}/clickedOpenIssueButton`)

export {
  appReady,
  changedHotkey,
  clickedCopyButton,
  clickedDonate,
  clickedEyeButton,
  clickedFavButton,
  clickedHomepageButton,
  clickedMaybeLater,
  clickedOpenIssueButton,
  clickedRescanApps,
  clickedSetAsDefaultBrowserButton,
  clickedTabButton,
  clickedTile,
  clickedUpdateAvailableButton,
  clickedUpdateButton,
  clickedUpdateRestartButton,
  clickedUrlBackspaceButton,
  gotAppVersion,
  gotDefaultBrowserStatus,
  keydown,
  prefsStarted,
  pressedAppKey,
  pressedBackspaceKey,
  pressedCopyKey,
  pressedEscapeKey,
  syncApps,
  syncData,
  syncStorage,
  tilesStarted,
  tWindowBoundsChanged,
  updateAvailable,
  updateDownloaded,
  updateDownloading,
  urlOpened,
}
