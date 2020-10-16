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
