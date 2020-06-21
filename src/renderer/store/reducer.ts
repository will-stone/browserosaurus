import { createReducer } from '@reduxjs/toolkit'

import { Store as MainStore } from '../../main/store'
import { receivedStore, updateFavClicked } from './actions'

const mainStoreIntialState: MainStore = {
  fav: '',
  hiddenTileIds: [],
  hotkeys: {},
}

const mainStore = createReducer(mainStoreIntialState, (builder) =>
  builder
    .addCase(receivedStore, (state, action) => action.payload)
    .addCase(updateFavClicked, (state, action) => {
      state.fav = action.payload
    }),
)

export { mainStore }
