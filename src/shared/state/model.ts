import type { AnyAction, Dispatch, ThunkDispatch } from '@reduxjs/toolkit'

import type { RootState } from './reducer.root'

export type Middleware = (api: {
  dispatch: ThunkDispatch<RootState, undefined, AnyAction>
  getState: () => RootState
}) => (
  next: Dispatch<AnyAction>,
) => (event: AnyAction) => ReturnType<Dispatch<AnyAction>>
