import type { Dispatch, ThunkDispatch } from '@reduxjs/toolkit'

import type { RootState } from './reducer.root'

export interface FSA {
  type: string
  payload?: unknown
  error?: boolean
  meta?: Record<string, unknown>
}

export type Middleware = (api: {
  dispatch: ThunkDispatch<RootState, undefined, FSA>
  getState: () => RootState
}) => (next: Dispatch<FSA>) => (event: FSA) => ReturnType<Dispatch<FSA>>
