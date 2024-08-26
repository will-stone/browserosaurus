/* eslint-disable unicorn/prefer-spread -- see https://redux-toolkit.js.org/api/getDefaultMiddleware#intended-usage */

import { configureStore } from '@reduxjs/toolkit'
import { app } from 'electron'

import { Channel } from '../../shared/state/channels.js'
import { channelInjectorMiddleware } from '../../shared/state/middleware.channel-injector.js'
import { logMiddleware } from '../../shared/state/middleware.log.js'
import { defaultData } from '../../shared/state/reducer.data.js'
import type { RootState } from '../../shared/state/reducer.root.js'
import { rootReducer } from '../../shared/state/reducer.root.js'
import { database } from '../database.js'
import { actionHubMiddleware } from './middleware.action-hub.js'
import { busMiddleware } from './middleware.bus.js'

const channel = Channel.MAIN

const preloadedState: RootState = {
  data: {
    ...defaultData,
    isDefaultProtocolClient: app.isDefaultProtocolClient('http'),
    version: `${app.getVersion()}${app.isPackaged ? '' : ' DEV'}`,
  },
  storage: database.getAll(),
}

const { dispatch, getState } = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false })
      .prepend(channelInjectorMiddleware(channel))
      .concat(busMiddleware())
      .concat(actionHubMiddleware())
      .concat(logMiddleware()),
  preloadedState,
  reducer: rootReducer,
})

export { dispatch, getState }
