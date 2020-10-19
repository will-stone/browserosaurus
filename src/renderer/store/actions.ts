import { createAction as cA } from '@reduxjs/toolkit'

import { App } from '../../config/types'
import { Store as MainStore } from '../../main/store'

// -----------------------------------------------------------------------------
// App
// -----------------------------------------------------------------------------
const appStarted = cA('app/started')

// -----------------------------------------------------------------------------
// Main events
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Settings
// -----------------------------------------------------------------------------
const changedHotkey = cA<{ appId: string; value: string }>(
  'settings/changedHotkey',
)
const clickedCloseMenuButton = cA('settings/clickedCloseMenuButton')
const clickedEyeButton = cA<string>('settings/clickedEyeButton')
const clickedFavButton = cA<string>('settings/clickedFavButton')
const clickedSetAsDefaultButton = cA('settings/clickedSetAsDefaultButton')
const clickedSponsorButton = cA('settings/clickedSponsorButton')
const clickedThemeButton = cA<MainStore['theme']>('settings/clickedThemeButton')
const clickedVersionButton = cA('settings/clickedVersionButton')

// -----------------------------------------------------------------------------
// URL bar
// -----------------------------------------------------------------------------
const clickedSettingsButton = cA('urlBar/clickedSettingsButton')
const clickedUrlBackspaceButton = cA('urlBar/clickedUrlBackspaceButton')

export {
  appStarted,
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
  changedHotkey,
  clickedCloseMenuButton,
  clickedEyeButton,
  clickedFavButton,
  clickedSetAsDefaultButton,
  clickedSponsorButton,
  clickedThemeButton,
  clickedVersionButton,
  clickedSettingsButton,
  clickedUrlBackspaceButton,
}
