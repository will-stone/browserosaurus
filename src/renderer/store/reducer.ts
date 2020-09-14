import { createReducer } from '@reduxjs/toolkit'

import { DEFAULT_URL, SPONSOR_URL } from '../../config/CONSTANTS'
import { App } from '../../config/types'
import { Store as MainStore } from '../../main/store'
import { alterHotkeys } from '../../utils/alterHotkeys'
import { backspaceUrlParse } from '../../utils/backspaceUrlParse'
import {
  clickedCloseMenuButton,
  clickedSettingsButton,
  clickedSponsorButton,
  clickedThemeButton,
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
} from './actions'

// ------------------
// Apps Reducer
// ------------------

const apps = createReducer<App[]>([], (builder) =>
  builder.addCase(receivedApps, (state, action) => action.payload),
)

// ------------------
// Main Store Reducer
// ------------------

const mainStore = createReducer<MainStore>(
  {
    fav: '',
    hiddenTileIds: [],
    hotkeys: {},
    theme: 'dark',
  },
  (builder) =>
    builder
      .addCase(receivedStore, (state, action) => action.payload)
      .addCase(madeTileFav, (state, action) => {
        state.fav = action.payload
      })
      .addCase(toggledTileVisibility, (state, action) => {
        // Remove the id if it exists in the array
        const updatedHiddenTileIds = state.hiddenTileIds.filter(
          (id) => id !== action.payload,
        )

        // If no id was removed, it didn't exist to begin with and should be added
        if (updatedHiddenTileIds.length === state.hiddenTileIds.length) {
          updatedHiddenTileIds.push(action.payload)
        }

        state.hiddenTileIds = updatedHiddenTileIds
      })
      .addCase(updatedTileHotkey, (state, action) => {
        const updatedHotkeys = alterHotkeys(
          state.hotkeys,
          action.payload.appId,
          action.payload.value,
        )
        state.hotkeys = updatedHotkeys
      })
      .addCase(clickedThemeButton, (state, action) => {
        state.theme = action.payload
      }),
)

// ------------------
// UI Reducer
// ------------------

interface UiState {
  menu: false | 'tiles'
  url: string
  version: string
  updateStatus: 'no-update' | 'available' | 'downloaded'
  isDefaultProtocolClient: boolean
}

const ui = createReducer<UiState>(
  {
    menu: false,
    version: '',
    updateStatus: 'no-update',
    isDefaultProtocolClient: true,
    url: DEFAULT_URL,
  },
  (builder) =>
    builder
      .addCase(clickedCloseMenuButton, (state) => {
        state.menu = false
      })
      .addCase(clickedSettingsButton, (state) => {
        if (state.menu) state.menu = false
        else state.menu = 'tiles'
      })
      // Close menu when escape key is pressed
      .addCase(pressedEscapeKey, (state) => {
        state.menu = false
      })
      .addCase(receivedUrl, (state, action) => {
        state.menu = false
        state.url = action.payload
      })
      .addCase(clickedUrlBackspaceButton, (state) => {
        state.url = backspaceUrlParse(state.url)
      })
      .addCase(pressedBackspaceKey, (state) => {
        state.url = backspaceUrlParse(state.url)
      })
      .addCase(clickedSponsorButton, (state) => {
        state.url = SPONSOR_URL
        state.menu = false
      })
      .addCase(receivedVersion, (state, action) => {
        state.version = action.payload
      })
      .addCase(receivedUpdateAvailable, (state) => {
        state.updateStatus = 'available'
      })
      .addCase(receivedUpdateDownloaded, (state) => {
        state.updateStatus = 'downloaded'
      })
      .addCase(receivedDefaultProtocolClientStatus, (state, action) => {
        state.isDefaultProtocolClient = action.payload
      }),
)

export { apps, mainStore, ui }
