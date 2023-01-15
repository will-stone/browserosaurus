import {
  type CombinedState,
  type EnhancedStore,
  type PreloadedState,
  configureStore,
} from '@reduxjs/toolkit'
import { type NoInfer } from '@reduxjs/toolkit/dist/tsHelpers'

import { type Channel } from './channels'
import { channelInjectorMiddleware } from './middleware.channel-injector'
import { logMiddleware } from './middleware.log'
import { type FSA, type Middleware } from './model'
import { type RootState, rootReducer } from './reducer.root'

type BoundaryType = EnhancedStore<CombinedState<RootState>, FSA, Middleware[]>

const createStore = (
  channel: Channel,
  middleware: Middleware[],
  preloadedState?: PreloadedState<CombinedState<NoInfer<RootState>>>,
): BoundaryType =>
  configureStore({
    middleware: (getDefaultMiddleware) => [
      channelInjectorMiddleware(channel),
      ...getDefaultMiddleware({ thunk: false }),
      ...middleware,
      logMiddleware(),
    ],
    preloadedState,
    reducer: rootReducer,
  })

export default createStore
