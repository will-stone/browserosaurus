import { createAction } from '@reduxjs/toolkit'

import { App } from '../../config/types'
import { Store as MainStore } from '../../main/store'

const receivedStore = createAction<MainStore>('main/receivedStore')
const receivedUrl = createAction<string>('main/receivedUrl')
const receivedApps = createAction<App[]>('main/receivedApps')
const receivedVersion = createAction<string>('main/receivedVersion')
const receivedUpdateAvailable = createAction('main/receivedUpdateAvailable')
const receivedUpdateDownloaded = createAction('main/receivedUpdateDownloaded')
const receivedDefaultProtocolClientStatus = createAction<boolean>(
  'main/receivedDefaultProtocolClientStatus',
)

const appStarted = createAction('app/started')

const madeTileFav = createAction<string>('tile/madeTileFav')
const toggledTileVisibility = createAction<string>('tile/toggledTileVisibility')
const updatedTileHotkey = createAction<{ appId: string; value: string }>(
  'tile/updatedTileHotkey',
)

const foundMouse = createAction('ui/foundMouse')
const lostMouse = createAction('ui/lostMouse')

const clickedCloseMenuButton = createAction('ui/clickedCloseMenuButton')
const clickedCopyButton = createAction('ui/clickedCopyButton')
const clickedQuitButton = createAction('ui/clickedQuitButton')
const clickedReloadButton = createAction('ui/clickedReloadButton')
const clickedSetAsDefaultButton = createAction('ui/clickedSetAsDefaultButton')
const clickedSettingsButton = createAction('ui/clickedSettingsButton')
const clickedSponsorButton = createAction('ui/clickedSponsorButton')
const clickedTileButton = createAction<{ appId: string; isAlt: boolean }>(
  'ui/clickedTileButton',
)
const clickedUpdateButton = createAction('ui/clickedUpdateButton')
const clickedUrlBackspaceButton = createAction('ui/clickedUrlBackspaceButton')

const pressedAppKey = createAction<{ key: string; isAlt: boolean }>(
  'ui/pressedAppKey',
)
const pressedBackspaceKey = createAction('ui/pressedBackspaceKey')
const pressedCopyKey = createAction('ui/pressedCopyKey')
const pressedEscapeKey = createAction('ui/escapeKeyPressed')

export {
  appStarted,
  clickedCloseMenuButton,
  clickedCopyButton,
  clickedQuitButton,
  clickedReloadButton,
  clickedSetAsDefaultButton,
  clickedSponsorButton,
  clickedTileButton,
  clickedSettingsButton,
  clickedUpdateButton,
  clickedUrlBackspaceButton,
  foundMouse,
  lostMouse,
  madeTileFav,
  pressedAppKey,
  pressedBackspaceKey,
  pressedCopyKey,
  pressedEscapeKey,
  receivedApps,
  receivedDefaultProtocolClientStatus,
  receivedStore,
  receivedUpdateAvailable,
  receivedUpdateDownloaded,
  receivedUrl,
  receivedVersion,
  toggledTileVisibility,
  updatedTileHotkey,
}
