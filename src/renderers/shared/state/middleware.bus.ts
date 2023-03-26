import type { Channel } from '../../../shared/state/channels'
import type { Middleware } from '../../../shared/state/model'
import { customWindow } from '../custom.window'

/**
 * Pass actions between main and renderers
 */
export const busMiddleware =
  (channel: Channel): Middleware =>
  () =>
  (next) =>
  (action) => {
    /**
     * Move to next middleware
     */
    // eslint-disable-next-line node/callback-return -- must flush to get nextState
    const result = next(action)

    // Only send actions from this channel to prevent an infinite loop.
    if (action.meta?.channel === channel) {
      customWindow.electron.send(channel, action)
    }

    return result
  }
