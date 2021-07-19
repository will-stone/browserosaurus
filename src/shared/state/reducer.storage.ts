import { createReducer } from '@reduxjs/toolkit'
import xor from 'lodash/xor'

import { alterHotkeys } from '../utils/alter-hotkeys'
import {
  changedHotkey,
  clickedDonate,
  clickedEyeButton,
  clickedFavButton,
  clickedMaybeLater,
  syncStorage,
  tWindowBoundsChanged,
} from './actions'
import type { App } from './reducer.apps'

export type Hotkeys = { [key: string]: App['id'] }

export interface Storage {
  supportMessage: number
  fav: string
  firstRun: boolean
  hotkeys: Hotkeys
  hiddenTileIds: string[]
  width: number
  height: number
}

export const defaultStorage: Storage = {
  supportMessage: 0,
  fav: 'com.apple.Safari',
  firstRun: true,
  hotkeys: {},
  hiddenTileIds: [],
  width: 424,
  height: 204,
}

export const storage = createReducer<Storage>(defaultStorage, (builder) =>
  builder
    .addCase(syncStorage, (state, action) => action.payload)

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
      state.supportMessage = -1
    })

    .addCase(clickedMaybeLater, (state) => {
      state.supportMessage = Date.now()
    })

    .addCase(tWindowBoundsChanged, (state, action) => {
      state.width = action.payload.width
      state.height = action.payload.height
    }),
)
