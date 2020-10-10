import { Middleware } from '@reduxjs/toolkit'

import {
  shallowEqualArrays,
  shallowEqualObjects,
} from '../../utils/shallow-equal'
import { receivedStore } from '../components/hooks/use-main-events'
import {
  changeTheme,
  selectFav,
  updateHiddenTileIds,
  updateHotkeys,
} from '../sendToMain'
import { RootState } from '.'

/**
 * Act on state changes
 */
export const onStateChangeMiddleware = (): Middleware<
  // legacy type parameter added to satisfy interface signature
  Record<string, unknown>,
  RootState
> => (store) => (next) => (action) => {
  const previousState = store.getState()
  // eslint-disable-next-line node/callback-return -- must flush to get nextState
  const result = next(action)
  const nextState = store.getState()

  // Send main store changes back to main, but ignore initial hydration
  if (!receivedStore.match(action)) {
    // Fav
    if (previousState.ui.fav !== nextState.ui.fav) {
      selectFav(nextState.ui.fav)
    }

    // Hidden tiles
    if (
      !shallowEqualArrays(
        previousState.ui.hiddenTileIds,
        nextState.ui.hiddenTileIds,
      )
    ) {
      updateHiddenTileIds(nextState.ui.hiddenTileIds)
    }

    // Hotkeys
    if (!shallowEqualObjects(previousState.ui.hotkeys, nextState.ui.hotkeys)) {
      updateHotkeys(nextState.ui.hotkeys)
    }

    // Theme
    if (previousState.ui.theme !== nextState.ui.theme) {
      changeTheme(nextState.ui.theme)
    }
  }

  return result
}
