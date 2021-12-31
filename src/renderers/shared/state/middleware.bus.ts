import type { Channel } from '../../../shared/state/channels'
import type { Middleware } from '../../../shared/state/model'
import { addChannelToAction } from '../../../shared/utils/add-channel-to-action'
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

    // Only send actions from this channel (actions that haven't had a meta
    // channel added yet) to prevent an infinite loop.
    if (!action.meta?.channel) {
      customWindow.electron.send(channel, addChannelToAction(action, channel))
    }

    return result
  }
