/* eslint-disable unicorn/prefer-regexp-test */
import {
  clickedDonate,
  clickedMaybeLater,
  clickedRestorePicker,
  installedAppsRetrieved,
  urlOpened,
} from '../../../shared/state/actions'
import type { Middleware } from '../../../shared/state/model'
import { favAppRef } from '../refs'

/**
 * Pass actions between main and renderers
 */
export const pickerMiddleware = (): Middleware => () => (next) => (action) => {
  /**
   * Move to next middleware
   */
  // eslint-disable-next-line node/callback-return -- must flush to get nextState
  const result = next(action)

  if (
    urlOpened.match(action) ||
    clickedRestorePicker.match(action) ||
    installedAppsRetrieved.match(action) ||
    clickedDonate.match(action) ||
    clickedMaybeLater.match(action)
  ) {
    favAppRef.current?.focus()
  }

  return result
}
