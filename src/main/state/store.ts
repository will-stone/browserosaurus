/* eslint-disable unicorn/prefer-spread -- see https://redux-toolkit.js.org/api/getDefaultMiddleware#intended-usage */

import { configureStore } from '@reduxjs/toolkit'
import { app } from 'electron'

import { Channel } from '../../shared/state/channels'
import { channelInjectorMiddleware } from '../../shared/state/middleware.channel-injector'
import { logMiddleware } from '../../shared/state/middleware.log'
import { defaultData } from '../../shared/state/reducer.data'
import type { RootState } from '../../shared/state/reducer.root'
import { rootReducer } from '../../shared/state/reducer.root'
import { database } from '../database'
import { actionHubMiddleware } from './middleware.action-hub'
import { busMiddleware } from './middleware.bus'

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
