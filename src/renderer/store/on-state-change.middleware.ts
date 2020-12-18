import { AnyAction, Middleware } from '@reduxjs/toolkit'

import { shallowEqualObjects } from '../../utils/shallow-equal'
import { updateHotkeys } from '../sendToMain'
import { RootState } from '.'
import { receivedStore } from './actions'

/**
 * Act on state changes
 */
export const onStateChangeMiddleware = (): Middleware<
  // legacy type parameter added to satisfy interface signature
  Record<string, unknown>,
  RootState
> => (store) => (next) => (action: AnyAction) => {
  const previousState = store.getState()
  // eslint-disable-next-line node/callback-return -- must flush to get nextState
  const result = next(action)
  const nextState = store.getState()

  // Send main store changes back to main, but ignore initial hydration
  if (!receivedStore.match(action)) {
    // Hotkeys
    if (!shallowEqualObjects(previousState.ui.hotkeys, nextState.ui.hotkeys)) {
      updateHotkeys(nextState.ui.hotkeys)
    }
  }

  return result
}
