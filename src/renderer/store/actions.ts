import { createAction } from '@reduxjs/toolkit'

import { App } from '../../config/types'
import { Store as MainStore } from '../../main/store'

// -----------------------------------------------------------------------------
// App
// -----------------------------------------------------------------------------
export const appStarted = createAction('app/started')

// -----------------------------------------------------------------------------
// Main events
// -----------------------------------------------------------------------------
export const receivedStore = createAction<MainStore>('main/receivedStore')
export const receivedApps = createAction<App[]>('main/receivedApps')
export const receivedVersion = createAction<string>('main/receivedVersion')
export const receivedUpdateAvailable = createAction(
  'main/receivedUpdateAvailable',
)
export const receivedUpdateDownloaded = createAction(
  'main/receivedUpdateDownloaded',
)
export const receivedUrl = createAction<string>('main/receivedUrl')
export const receivedDefaultProtocolClientStatus = createAction<boolean>(
  'main/receivedDefaultProtocolClientStatus',
)

// -----------------------------------------------------------------------------
// Keyboard
// -----------------------------------------------------------------------------
export const keydown = createAction<{
  isAlt: boolean
  isCmd: boolean
  isShift: boolean
  code: string
  key: string
  keyCode: number
}>('keyboard/keydown')
export const pressedEscapeKey = createAction('keyboard/escapeKey')
export const pressedBackspaceKey = createAction('keyboard/backspaceKey')

// -----------------------------------------------------------------------------
// Settings
// -----------------------------------------------------------------------------
export const changedHotkey = createAction<{ appId: string; value: string }>(
  'settings/changedHotkey',
)
export const clickedCloseMenuButton = createAction(
  'settings/clickedCloseMenuButton',
)
export const clickedEyeButton = createAction<string>(
  'settings/clickedEyeButton',
)
export const clickedFavButton = createAction<string>(
  'settings/clickedFavButton',
)
export const clickedSetAsDefaultButton = createAction(
  'settings/clickedSetAsDefaultButton',
)
export const clickedSponsorButton = createAction(
  'settings/clickedSponsorButton',
)
export const clickedThemeButton = createAction<MainStore['theme']>(
  'settings/clickedThemeButton',
)
export const clickedVersionButton = createAction(
  'settings/clickedVersionButton',
)

// -----------------------------------------------------------------------------
// URL bar
// -----------------------------------------------------------------------------
export const clickedSettingsButton = createAction(
  'urlBar/clickedSettingsButton',
)
export const clickedUrlBackspaceButton = createAction(
  'urlBar/clickedUrlBackspaceButton',
)
