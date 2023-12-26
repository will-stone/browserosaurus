import { addChannelToAction } from '../utils/add-channel-to-action.js'
import type { Channel } from './channels.js'
import type { Middleware } from './model.js'
import { isFSA } from './model.js'

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
    if (!isFSA(action)) return next(action)

    const actionWithChannel = action.meta?.channel
      ? action
      : addChannelToAction(action, channel)

    return next(actionWithChannel)
  }
