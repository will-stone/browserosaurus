import { AnyAction, Middleware } from '@reduxjs/toolkit'

import { RootState } from './root.reducer'

/**
 * Log all actions to console
 */
export const logMiddleware =
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

    // eslint-disable-next-line no-console
    console.log(action.type, action.payload)

    return result
  }
