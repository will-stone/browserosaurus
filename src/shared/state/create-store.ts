import type { AnyAction, CombinedState, EnhancedStore } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'

import { logMiddleware } from './middleware.log'
import type { Middleware } from './model'
import type { RootState } from './reducer.root'
import { rootReducer } from './reducer.root'

type BoundaryType = EnhancedStore<
  CombinedState<RootState>,
  AnyAction,
  Middleware[]
>

const createStore = (middleware: Middleware[]): BoundaryType =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      ...middleware,
      logMiddleware(),
    ],
  })

export default createStore
