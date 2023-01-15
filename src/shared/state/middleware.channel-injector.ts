import { addChannelToAction } from '../utils/add-channel-to-action'
import { type Channel } from './channels'
import { type Middleware } from './model'

/**
 * Adds the current channel to actions if it is not present.
 * This must be the first middleware in the chain so that other middleware and
 * reducers can access action.meta.channel
 */
export const channelInjectorMiddleware =
  (channel: Channel): Middleware =>
  () =>
  (next) =>
  (action) => {
    const actionWithChannel = action.meta?.channel
      ? action
      : addChannelToAction(action, channel)

    // Move to next middleware
    return next(actionWithChannel)
  }
