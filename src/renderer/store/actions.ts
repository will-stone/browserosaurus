import { createAction } from '@reduxjs/toolkit'

import { Store as MainStore } from '../../main/store'

const receivedStore = createAction<MainStore>('main/storeReceived')
const receivedUrl = createAction<string>('main/urlReceived')

const madeTileFav = createAction<string>('tile/madeFav')
const toggledTileVisibility = createAction<string>('tile/visibilityToggled')
const updatedTileHotkey = createAction<{ browserId: string; value: string }>(
  'tile/hotkeyUpdated',
)

const clickedUrlBackspaceButton = createAction('ui/urlBackspaceButtonClicked')
const clickedTilesMenuButton = createAction('ui/tilesMenuButtonClicked')
const clickedSponsorMenuButton = createAction('ui/sponsorMenuButtonClicked')
const clickedMenuBackdrop = createAction('ui/menuBackdropClicked')
const clickedSponsorButton = createAction('ui/sponsorButtonClicked')

const pressedEscapeKey = createAction('ui/escapeKeyPressed')
const pressedBackspaceKey = createAction('ui/backspaceKeyPressed')

export {
  clickedMenuBackdrop,
  clickedSponsorButton,
  clickedSponsorMenuButton,
  clickedTilesMenuButton,
  clickedUrlBackspaceButton,
  madeTileFav,
  pressedBackspaceKey,
  pressedEscapeKey,
  receivedStore,
  receivedUrl,
  toggledTileVisibility,
  updatedTileHotkey,
}
