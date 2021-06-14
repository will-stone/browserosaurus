import { AnyAction, Middleware } from '@reduxjs/toolkit'
import { ipcRenderer } from 'electron'

import { Channel } from '../channels'
import { RootState } from '../preferences/store'

/**
 * Act on state changes
 */
export const sendToMainMiddleware =
  (
    channel: Channel,
  ): Middleware<
    // legacy type parameter added to satisfy interface signature
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

    ipcRenderer.send(channel, action)

    return result
  }
