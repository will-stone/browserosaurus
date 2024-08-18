/* eslint-disable unicorn/prefer-regexp-test */
import type { Middleware } from 'redux'

import { clickedOpenPrefs } from '../../../main/state/actions'
import { getKeyLayout } from '../../shared/utils/get-key-layout-map'

/**
 * Pass actions between main and renderers
 */
export const prefsMiddleware =
  (): Middleware =>
  ({ dispatch }) =>
  (next) =>
  (action) => {
    // eslint-disable-next-line n/callback-return -- Move to next middleware
    const result = next(action)

    if (clickedOpenPrefs.match(action)) {
      getKeyLayout(dispatch)
    }

    return result
  }
