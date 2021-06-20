import { createReducer } from '@reduxjs/toolkit'
import xor from 'lodash/xor'

import type { PermaStore } from '../../main/state/perma-store'
import { alterHotkeys } from '../utils/alter-hotkeys'
import {
  changedHotkey,
  clickedAlreadyDonated,
  clickedDonate,
  clickedEyeButton,
  clickedFavButton,
  clickedMaybeLater,
  syncStorage,
  tWindowBoundsChanged,
} from './actions'

export const storage = createReducer<PermaStore>(
  {
    fav: '',
    hiddenTileIds: [],
    hotkeys: {},
    // Hide by default to prevent flash of message on reload
    supportMessage: -1,
  },
  (builder) =>
    builder
      .addCase(syncStorage, (state, action) => {
        // Split them in case some meta data comes from electron-store
        state.fav = action.payload.fav
        state.hiddenTileIds = action.payload.hiddenTileIds
        state.hotkeys = action.payload.hotkeys
        state.supportMessage = action.payload.supportMessage
      })

      .addCase(changedHotkey, (state, action) => {
        const updatedHotkeys = alterHotkeys(
          state.hotkeys,
          action.payload.appId,
          action.payload.value,
        )
        state.hotkeys = updatedHotkeys
      })

      .addCase(clickedEyeButton, (state, action) => {
        const { hiddenTileIds } = state
        // Remove the id if it exists in the array, or add it if it doesn't
        state.hiddenTileIds = xor(hiddenTileIds, [action.payload])
      })

      .addCase(clickedFavButton, (state, action) => {
        state.fav = action.payload
      })

      .addCase(clickedDonate, (state) => {
        state.supportMessage = Date.now()
      })

      .addCase(clickedMaybeLater, (state) => {
        state.supportMessage = Date.now()
      })

      .addCase(clickedAlreadyDonated, (state) => {
        state.supportMessage = -1
      })

      .addCase(tWindowBoundsChanged, (state, action) => {
        state.bounds = action.payload
      }),
)
