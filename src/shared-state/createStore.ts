import type {
  AnyAction,
  CombinedState,
  EnhancedStore,
  Middleware,
} from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'

import { logMiddleware } from './log.middleware'
import { rootReducer, RootState } from './root.reducer'

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

const createStore = (middleware: TypedMiddleware[] = []): BoundaryType =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      ...middleware,
      logMiddleware(),
    ],
  })

export default createStore
