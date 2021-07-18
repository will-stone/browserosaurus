import { AnyAction, Middleware } from '@reduxjs/toolkit'

import { Channel } from '../../../shared/state/channels'
import { RootState } from '../../../shared/state/reducer.root'
import { customWindow } from '../custom.window'

/**
 * Pass actions between main and renderers
 */
export const busMiddleware =
  (
    channel: Channel,
  ): Middleware<
    // Legacy type parameter added to satisfy interface signature
    Record<string, unknown>,
    RootState
  > =>
  () =>
  (next) =>
  (action: AnyAction) => {
    /**
     * Move to next middleware
     */
    // eslint-disable-next-line node/callback-return -- must flush to get nextState
    const result = next(action)

    // Only send actions from this channel to prevent an infinite loop
    if (action.type.startsWith(channel)) {
      customWindow.electron.send(channel, action)
    }

    return result
  }
