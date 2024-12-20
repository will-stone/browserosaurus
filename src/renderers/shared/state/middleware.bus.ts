import type { Middleware } from 'redux'

import type { Channel } from '../../../shared/state/channels.js'
import { isFSA } from '../../../shared/state/model.js'

/**
 * Pass actions between main and renderers
 */
export const busMiddleware =
  (channel: Channel): Middleware =>
  () =>
  (next) =>
  (action) => {
    if (!isFSA(action)) return next(action)

    /**
     * Move to next middleware
     */
    // eslint-disable-next-line n/callback-return -- must flush to get nextState
    const result = next(action)

    // Only send actions from this channel to prevent an infinite loop.
    if (action.meta?.channel === channel) {
      globalThis.electron.send(channel, action)
    }

    return result
  }
