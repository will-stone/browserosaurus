import { AnyAction, Middleware } from '@reduxjs/toolkit'

import { bWindow, pWindow } from '../main/windows'
import { Channel } from '../shared-state/channels'
import { RootState } from '../shared-state/root.reducer'

/**
 * Pass actions between main and renderers
 */
export const busMiddleware =
  (): Middleware<
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
    if (action.type.startsWith(Channel.MAIN)) {
      bWindow?.webContents.send(Channel.MAIN, action)
      pWindow?.webContents.send(Channel.MAIN, action)
    }

    return result
  }
