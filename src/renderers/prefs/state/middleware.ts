/* eslint-disable unicorn/prefer-regexp-test */
import { clickedOpenPrefs } from '../../../shared/state/actions'
import type { Channel } from '../../../shared/state/channels'
import type { Middleware } from '../../../shared/state/model'
import { getKeyLayout } from '../../shared/state/thunk.get-key-layout-map'

/**
 * Pass actions between main and renderers
 */
export const prefsMiddleware =
  (channel: Channel): Middleware =>
  ({ dispatch }) =>
  (next) =>
  (action) => {
    // eslint-disable-next-line node/callback-return -- Move to next middleware
    const result = next(action)

    if (clickedOpenPrefs.match(action)) {
      dispatch(getKeyLayout(channel))
    }

    return result
  }
