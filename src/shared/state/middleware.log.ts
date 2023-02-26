import { actionLogger } from '../utils/action-logger'
import type { Middleware } from './model'

/**
 * Log all actions to console
 */
export const logMiddleware = (): Middleware => () => (next) => (action) => {
  // TODO figure out how to use `app.isPackaged` in an isomorphic way.
  if (process.env.NODE_ENV === 'development') {
    actionLogger(action)
  }

  // Move to next middleware
  return next(action)
}
