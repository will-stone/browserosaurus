import { configureStore } from '@reduxjs/toolkit'

import { sendToMainMiddleware } from '../utils/send-to-main.middleware'
import { Channel } from './channels'
import { rootReducer } from './root.reducer'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const createStore = (channel: Channel) =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      sendToMainMiddleware(channel),
    ],
  })

export default createStore
