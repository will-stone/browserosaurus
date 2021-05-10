import { AnyAction, Middleware } from '@reduxjs/toolkit'
import { ipcRenderer } from 'electron'

import { RootState } from '.'

/**
 * Act on state changes
 */
export const sendToMainMiddleware =
  (): Middleware<
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

    ipcRenderer.send('FROM_RENDERER', action)

    return result
  }
