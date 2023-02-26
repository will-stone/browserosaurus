/* eslint-disable unicorn/prefer-regexp-test */
import { clickedOpenPrefs } from '../../../main/state/actions'
import type { Middleware } from '../../../shared/state/model'
import { getKeyLayout } from '../../shared/utils/get-key-layout-map'

/**
 * Pass actions between main and renderers
 */
export const prefsMiddleware =
  (): Middleware =>
  ({ dispatch }) =>
  (next) =>
  (action) => {
    // eslint-disable-next-line node/callback-return -- Move to next middleware
    const result = next(action)

    if (clickedOpenPrefs.match(action)) {
      getKeyLayout(dispatch)
    }

    return result
  }
