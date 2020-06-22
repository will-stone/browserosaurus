/* eslint-disable node/callback-return -- allows using next at top of middleware */

import { Middleware } from 'redux'

import { updateFav, updateHiddenTileIds } from '../sendToMain'
import { RootState } from '.'
import { madeTileFav, toggledTileVisibility } from './actions'

export const middleware: Middleware<unknown, RootState> = (store) => (next) => (
  action,
) => {
  // Moving on to next action ensures reducer has run for this action and state is up-to-date
  const result = next(action)

  if (madeTileFav.match(action)) {
    updateFav(action.payload)
  }

  if (toggledTileVisibility.match(action)) {
    updateHiddenTileIds(store.getState().mainStore.hiddenTileIds)
  }

  return result
}
