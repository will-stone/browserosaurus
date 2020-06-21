/* eslint-disable node/callback-return -- allows using next at top of middleware */

import { Middleware } from 'redux'

import { updateFav } from '../sendToMain'
import { RootState } from '.'
import { receivedStore, updateFavClicked } from './actions'

export const middleware: Middleware<unknown, RootState> = (store) => (next) => (
  action,
) => {
  const result = next(action)

  if (receivedStore.match(action)) {
    console.log(store.getState().mainStore)
  }

  if (updateFavClicked.match(action)) {
    updateFav(action.payload)
  }

  return result
}
