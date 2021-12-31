import { actionLogger } from '../utils/action-logger'
import { addChannelToAction } from '../utils/add-channel-to-action'
import type { Channel } from './channels'
import type { Middleware } from './model'

/**
 * Log all actions to console
 */
export const logMiddleware =
  (channel: Channel): Middleware =>
  () =>
  (next) =>
  (action) => {
    // TODO figure out how to use `app.isPackaged` in an isomorphic way.
    if (process.env.NODE_ENV === 'development') {
      const actionWithChannel = action.meta?.channel
        ? action
        : addChannelToAction(action, channel)
      actionLogger(actionWithChannel)
    }

    /**
     * Move to next middleware
     */

    return next(action)
  }
