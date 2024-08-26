import { actionLogger } from '../utils/action-logger.js'
import type { Middleware } from './model.js'
import { isFSA } from './model.js'

/**
 * Log all actions to console
 */
export const logMiddleware = (): Middleware => () => (next) => (action) => {
  // TODO figure out how to use `app.isPackaged` in an isomorphic way.
  if (process.env.NODE_ENV === 'development' && isFSA(action)) {
    actionLogger(action)
  }

  // Move to next middleware
  return next(action)
}
