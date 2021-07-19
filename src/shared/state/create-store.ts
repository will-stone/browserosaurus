import type {
  AnyAction,
  CombinedState,
  EnhancedStore,
  Middleware,
} from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'

import { logMiddleware } from './middleware.log'
import type { RootState } from './reducer.root'
import { defaultState, rootReducer } from './reducer.root'

type TypedMiddleware = Middleware<
  // Legacy type parameter added to satisfy interface signature
  Record<string, unknown>,
  RootState
>

type BoundaryType = EnhancedStore<
  CombinedState<RootState>,
  AnyAction,
  TypedMiddleware[]
>

const createStore = (
  middleware: TypedMiddleware[],
  preloadedState: Partial<RootState> = {},
): BoundaryType =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      ...middleware,
      logMiddleware(),
    ],
    preloadedState: {
      ...defaultState,
      ...preloadedState,
    },
  })

export default createStore
