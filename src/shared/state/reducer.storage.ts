import { createReducer } from '@reduxjs/toolkit'
import type { Rectangle } from 'electron'
import xor from 'lodash/xor'

import { alterHotkeys } from '../utils/alter-hotkeys'
import {
  changedHotkey,
  clickedAlreadyDonated,
  clickedDonate,
  clickedEyeButton,
  clickedFavButton,
  clickedMaybeLater,
  gotStore,
} from './actions'
import type { App } from './reducer.apps'

type Hotkeys = { [key in string]: App['id'] }

export interface Storage {
  bounds?: Rectangle
  fav: string
  firstRun?: boolean
  hiddenTileIds: string[]
  hotkeys: Hotkeys
  supportMessage: number
}

export const storage = createReducer<Storage>(
  {
    fav: '',
    firstRun: false,
    hiddenTileIds: [],
    hotkeys: {},
    // Hide by default to prevent flash of message on reload
    supportMessage: -1,
  },
  (builder) =>
    builder
      .addCase(gotStore, (state, action) => {
        state.fav = action.payload.fav
        state.firstRun = action.payload.firstRun
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
      }),
)
