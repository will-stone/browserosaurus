/* eslint-disable prefer-destructuring -- enums cannot be destructured */
import { createAction as cA } from '@reduxjs/toolkit'

import type { PermaStore } from '../../main/state/perma-store'
import { Channel } from './channels'
import type { App } from './reducer.apps'
import type { ThemeState } from './reducer.theme'

const MAIN = Channel.MAIN
const TILES = Channel.TILES
const PREFS = Channel.PREFS

// -----------------------------------------------------------------------------
// MAIN
// -----------------------------------------------------------------------------

const urlUpdated = cA<string>(`${MAIN}/urlUpdated`)

const gotTheme = cA<ThemeState>(`${MAIN}/gotTheme`)
const gotAppVersion = cA<string>(`${MAIN}/gotAppVersion`)
const gotInstalledApps = cA<App[]>(`${MAIN}/gotInstalledApps`)
const gotDefaultBrowserStatus = cA<boolean>(`${MAIN}/gotDefaultBrowserStatus`)
const gotStore = cA<PermaStore>(`${MAIN}/gotStore`)

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

const changedHotkey = cA<{ appId: string; value: string }>(
  `${TILES}/changedHotkey`,
)
const clickedCloseMenuButton = cA(`${TILES}/clickedCloseMenuButton`)
const clickedEyeButton = cA<string>(`${TILES}/clickedEyeButton`)
const clickedFavButton = cA<string>(`${TILES}/clickedFavButton`)
const clickedQuitButton = cA(`${TILES}/clickedQuitButton`)
const clickedReloadButton = cA(`${TILES}/clickedReloadButton`)
const clickedSetAsDefaultBrowserButton = cA(
  `${TILES}/clickedSetAsDefaultBrowserButton`,
)
const clickedUpdateButton = cA(`${TILES}/clickedUpdateButton`)
const clickedUpdateRestartButton = cA(`${TILES}/clickedUpdateRestartButton`)
const clickedBWebsiteButton = cA(`${TILES}/clickedBWebsiteButton`)

const clickedSettingsButton = cA(`${TILES}/clickedSettingsButton`)
const clickedUrlBackspaceButton = cA(`${TILES}/clickedUrlBackspaceButton`)
const clickedCopyButton = cA<string>(`${TILES}/clickedCopyButton`)

const clickedDonate = cA(`${TILES}/clickedDonate`)
const clickedMaybeLater = cA(`${TILES}/clickedMaybeLater`)
const clickedAlreadyDonated = cA(`${TILES}/clickedAlreadyDonated`)

// -----------------------------------------------------------------------------
// TILES
// -----------------------------------------------------------------------------

const prefsStarted = cA(`${PREFS}/started`)

export {
  changedHotkey,
  clickedAlreadyDonated,
  clickedBWebsiteButton,
  clickedCloseMenuButton,
  clickedCopyButton,
  clickedDonate,
  clickedEyeButton,
  clickedFavButton,
  clickedMaybeLater,
  clickedQuitButton,
  clickedReloadButton,
  clickedSetAsDefaultBrowserButton,
  clickedSettingsButton,
  clickedTile,
  clickedUpdateButton,
  clickedUpdateRestartButton,
  clickedUrlBackspaceButton,
  gotAppVersion,
  gotDefaultBrowserStatus,
  gotInstalledApps,
  gotStore,
  gotTheme,
  keydown,
  prefsStarted,
  pressedAppKey,
  pressedBackspaceKey,
  pressedCopyKey,
  pressedEscapeKey,
  tilesStarted,
  updateAvailable,
  updateDownloaded,
  updateDownloading,
  urlUpdated,
}
