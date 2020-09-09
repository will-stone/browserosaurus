import { createAction } from '@reduxjs/toolkit'

import { App } from '../../config/types'
import { Store as MainStore } from '../../main/store'

const receivedStore = createAction<MainStore>('main/storeReceived')
const receivedUrl = createAction<string>('main/urlReceived')
const receivedApps = createAction<App[]>('main/appsReceived')
const receivedVersion = createAction<string>('main/versionReceived')
const receivedUpdateAvailable = createAction('main/updateAvailableReceived')
const receivedUpdateDownloaded = createAction('main/updateDownloadedReceived')
const receivedDefaultProtocolClientStatus = createAction<boolean>(
  'main/defaultProtocolClientStatusReceived',
)

const madeTileFav = createAction<string>('tile/madeFav')
const toggledTileVisibility = createAction<string>('tile/visibilityToggled')
const updatedTileHotkey = createAction<{ appId: string; value: string }>(
  'tile/hotkeyUpdated',
)

const clickedUrlBackspaceButton = createAction('ui/urlBackspaceButtonClicked')
const clickedTilesMenuButton = createAction('ui/tilesMenuButtonClicked')
const clickedSponsorMenuButton = createAction('ui/sponsorMenuButtonClicked')
const clickedSponsorButton = createAction('ui/sponsorButtonClicked')
const clickedCloseMenuButton = createAction('ui/closeMenuButtonClicked')

const pressedEscapeKey = createAction('ui/escapeKeyPressed')
const pressedBackspaceKey = createAction('ui/backspaceKeyPressed')

export {
  clickedCloseMenuButton,
  clickedSponsorButton,
  clickedSponsorMenuButton,
  clickedTilesMenuButton,
  clickedUrlBackspaceButton,
  madeTileFav,
  pressedBackspaceKey,
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
