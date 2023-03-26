import type { Dispatch } from '@reduxjs/toolkit'

import type { RootState } from './reducer.root'

interface FSA {
  type: string
  payload?: unknown
  error?: boolean
  meta?: Record<string, unknown>
}

type Middleware = (api: {
  dispatch: Dispatch<FSA>
  getState: () => RootState
}) => (next: Dispatch<FSA>) => (event: FSA) => ReturnType<Dispatch<FSA>>

export { FSA, Middleware }
