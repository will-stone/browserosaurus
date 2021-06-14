import { AnyAction, Middleware } from '@reduxjs/toolkit'
import { ipcRenderer } from 'electron'

import { Channel } from '../shared-state/channels'

/**
 * Act on state changes
 */
export const sendToMainMiddleware =
  (
    channel: Channel,
  ): Middleware<
    // Legacy type parameter added to satisfy interface signature
    Record<string, unknown>,
    // This would usually be the typed root state but as this is shared between
    // renderer stores, this is not fully known. As the state is not required
    // in this middleware, it can be ignored.
    unknown
  > =>
  () =>
  (next) =>
  (action: AnyAction) => {
    /**
     * Move to next middleware
     */
    // eslint-disable-next-line node/callback-return -- must flush to get nextState
    const result = next(action)

    // Only send actions to main from this channel, this prevents an infinite loop
    if (action.type.startsWith(channel)) {
      ipcRenderer.send(channel, action)
    }

    return result
  }
