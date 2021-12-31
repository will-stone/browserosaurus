/* eslint-disable unicorn/prefer-regexp-test */
import {
  clickedRestorePicker,
  installedAppsRetrieved,
  urlOpened,
} from '../../../main/state/actions'
import type { Middleware } from '../../../shared/state/model'
import { getKeyLayout } from '../../shared/state/thunk.get-key-layout-map'
import { favAppRef } from '../refs'
import { clickedDonate, clickedMaybeLater } from './actions'

/**
 * Pass actions between main and renderers
 */
export const pickerMiddleware =
  (): Middleware =>
  ({ dispatch }) =>
  (next) =>
  (action) => {
    // eslint-disable-next-line node/callback-return -- Move to next middleware
    const result = next(action)

    const doesActionOpenPicker =
      urlOpened.match(action) || clickedRestorePicker.match(action)

    if (
      doesActionOpenPicker ||
      installedAppsRetrieved.match(action) ||
      clickedDonate.match(action) ||
      clickedMaybeLater.match(action)
    ) {
      favAppRef.current?.focus()
    }

    if (doesActionOpenPicker) {
      dispatch(getKeyLayout())
    }

    return result
  }
