/* eslint-disable node/callback-return -- allows using next at top of middleware */

import { Middleware } from 'redux'

import {
  escapePressed,
  updateFav,
  updateHiddenTileIds,
  updateHotkeys,
} from '../sendToMain'
import { RootState } from '.'
import {
  madeTileFav,
  pressedEscapeKey,
  toggledTileVisibility,
  updatedTileHotkey,
} from './actions'

export const middleware: Middleware<unknown, RootState> = (store) => (next) => (
  action,
) => {
  // Hide window if escape key is pressed when no menus are open
  if (pressedEscapeKey.match(action)) {
    if (!store.getState().ui.menu) {
      // TODO change to "closeWindow" or "hide"
      escapePressed()
    }
  }

  // Everything above here is run BEFORE reducers are calculated for the current action
  const result = next(action)
  // Everything below here is run AFTER reducers are calculated for the current action

  if (madeTileFav.match(action)) {
    updateFav(action.payload)
  }

  if (toggledTileVisibility.match(action)) {
    updateHiddenTileIds(store.getState().mainStore.hiddenTileIds)
  }

  if (updatedTileHotkey.match(action)) {
    updateHotkeys(store.getState().mainStore.hotkeys)
  }

  return result
}
