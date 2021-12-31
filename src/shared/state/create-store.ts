import type {
  AnyAction,
  CombinedState,
  EnhancedStore,
  PreloadedState,
} from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import type { NoInfer } from '@reduxjs/toolkit/dist/tsHelpers'

import type { Channel } from './channels'
import { channelInjectorMiddleware } from './middleware.channel-injector'
import { logMiddleware } from './middleware.log'
import type { Middleware } from './model'
import type { RootState } from './reducer.root'
import { rootReducer } from './reducer.root'

type BoundaryType = EnhancedStore<
  CombinedState<RootState>,
  AnyAction,
  Middleware[]
>

const createStore = (
  channel: Channel,
  middleware: Middleware[],
  preloadedState?: PreloadedState<CombinedState<NoInfer<RootState>>>,
): BoundaryType =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
      channelInjectorMiddleware(channel),
      ...getDefaultMiddleware(),
      ...middleware,
      logMiddleware(),
    ],
    preloadedState,
  })

export default createStore
