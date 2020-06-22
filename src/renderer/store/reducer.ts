import { createReducer } from '@reduxjs/toolkit'

import { SPONSOR_URL } from '../../config/CONTANTS'
import { Store as MainStore } from '../../main/store'
import { alterHotkeys } from '../../utils/alterHotkeys'
import { backspaceUrlParse } from '../../utils/backspaceUrlParse'
import {
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
} from './actions'

// ------------------
// Main Store Reducer
// ------------------

const mainStore = createReducer<MainStore>(
  {
    fav: '',
    hiddenTileIds: [],
    hotkeys: {},
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
          action.payload.browserId,
          // TODO move this lower casing ot alterHotkeys
          action.payload.value.toLowerCase(),
        )
        state.hotkeys = updatedHotkeys
      }),
)

// ------------------
// Menu Reducer
// ------------------

interface UiState {
  menu: false | 'tiles' | 'sponsor'
  url?: string
}

const ui = createReducer<UiState>({ menu: false }, (builder) =>
  builder
    .addCase(clickedTilesMenuButton, (state) => {
      if (state.menu) state.menu = false
      else state.menu = 'tiles'
    })
    .addCase(clickedSponsorMenuButton, (state) => {
      if (state.menu) state.menu = false
      else state.menu = 'sponsor'
    })
    // Close menu when escape key is pressed
    .addCase(pressedEscapeKey, (state) => {
      state.menu = false
    })
    // Close menu modal when backdrop clicked
    .addCase(clickedMenuBackdrop, (state) => {
      state.menu = false
    })
    // Close menus when new URL arrives
    .addCase(receivedUrl, (state) => {
      state.menu = false
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
    }),
)

export { mainStore, ui }
