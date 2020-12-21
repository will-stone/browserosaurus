import { createAction as cA } from '@reduxjs/toolkit'

import { App } from '../../config/types'
import { Store as MainStore } from '../../main/store'
import type { ThemeState } from './reducers'

interface OpenAppArguments {
  url: string
  appId: App['id'] | undefined
  isAlt: boolean
  isShift: boolean
}

// -----------------------------------------------------------------------------
// App
// -----------------------------------------------------------------------------
const appStarted = cA('app/started')

// -----------------------------------------------------------------------------
// Tiles
// -----------------------------------------------------------------------------
const clickedTile = cA<OpenAppArguments>('tiles/clickTile')

// -----------------------------------------------------------------------------
// Main events
// -----------------------------------------------------------------------------
const receivedTheme = cA<ThemeState>('main/receivedTheme')
const receivedStore = cA<MainStore>('main/receivedStore')
const receivedApps = cA<App[]>('main/receivedApps')
const receivedVersion = cA<string>('main/receivedVersion')
const receivedUpdateAvailable = cA('main/receivedUpdateAvailable')
const receivedUpdateDownloaded = cA('main/receivedUpdateDownloaded')
const receivedUrl = cA<string>('main/receivedUrl')
const receivedDefaultProtocolClientStatus = cA<boolean>(
  'main/receivedDefaultProtocolClientStatus',
)

// -----------------------------------------------------------------------------
// Keyboard
// -----------------------------------------------------------------------------
const keydown = cA<{
  isAlt: boolean
  isCmd: boolean
  isShift: boolean
  code: string
  key: string
  keyCode: number
}>('keyboard/keydown')
const pressedEscapeKey = cA('keyboard/escapeKey')
const pressedBackspaceKey = cA('keyboard/backspaceKey')
const pressedCopyKey = cA<string>('keyboard/copyKey')
const pressedAppKey = cA<OpenAppArguments>('keyboard/appKey')

// -----------------------------------------------------------------------------
// Settings
// -----------------------------------------------------------------------------
const changedHotkey = cA<{ appId: string; value: string }>(
  'settings/changedHotkey',
)
const clickedCloseMenuButton = cA('settings/clickedCloseMenuButton')
const clickedEyeButton = cA<string>('settings/clickedEyeButton')
const clickedFavButton = cA<string>('settings/clickedFavButton')
const clickedSponsorButton = cA('settings/clickedSponsorButton')
const clickedVersionButton = cA('settings/clickedVersionButton')
const clickedQuitButton = cA('settings/clickedQuitButton')
const clickedReloadButton = cA('settings/clickedReloadButton')
const clickedSetAsDefaultBrowserButton = cA(
  'settings/clickedSetAsDefaultBrowserButton',
)
const clickedUpdateRestartButton = cA('settings/clickedUpdateRestartButton')

// -----------------------------------------------------------------------------
// URL bar
// -----------------------------------------------------------------------------
const clickedSettingsButton = cA('urlBar/clickedSettingsButton')
const clickedUrlBackspaceButton = cA('urlBar/clickedUrlBackspaceButton')
const clickedCopyButton = cA<string>('urlBar/clickedCopyButton')

export {
  appStarted,
  clickedTile,
  receivedTheme,
  receivedStore,
  receivedApps,
  receivedVersion,
  receivedUpdateAvailable,
  receivedUpdateDownloaded,
  receivedUrl,
  receivedDefaultProtocolClientStatus,
  keydown,
  pressedEscapeKey,
  pressedBackspaceKey,
  pressedCopyKey,
  pressedAppKey,
  changedHotkey,
  clickedCloseMenuButton,
  clickedEyeButton,
  clickedFavButton,
  clickedSponsorButton,
  clickedVersionButton,
  clickedSettingsButton,
  clickedUrlBackspaceButton,
  clickedCopyButton,
  clickedQuitButton,
  clickedReloadButton,
  clickedSetAsDefaultBrowserButton,
  clickedUpdateRestartButton,
}
