import { AnyAction, Middleware } from '@reduxjs/toolkit'

import { actionLogger } from '../utils/action-logger'
import { RootState } from './reducer.root'

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
    // TODO figure out how to use `app.isPackaged` in an isomorphic way.
    if (process.env.NODE_ENV === 'development') {
      actionLogger(action)
    }

    /**
     * Move to next middleware
     */

    return next(action)
  }
