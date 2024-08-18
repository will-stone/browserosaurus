import type { Dispatch, Middleware as ReduxMiddleware } from '@reduxjs/toolkit'
import { isFluxStandardAction } from '@reduxjs/toolkit'

import type { RootState } from './reducer.root'

type FSA = {
  type: string
  payload?: unknown
  error?: boolean
  meta?: Record<string, unknown>
}

const isFSA = (action: unknown): action is FSA => {
  // TODO tighten this to ensure `error` and `meta` are correct shape
  return isFluxStandardAction(action)
}

type Middleware = ReduxMiddleware<Dispatch<FSA>, RootState, Dispatch<FSA>>

export { FSA, isFSA, Middleware }
