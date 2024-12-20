/* eslint-disable unicorn/prefer-spread -- see https://redux-toolkit.js.org/api/getDefaultMiddleware#intended-usage */

import type { Action } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'

import { Channel } from '../../../shared/state/channels.js'
import { channelInjectorMiddleware } from '../../../shared/state/middleware.channel-injector.js'
import { logMiddleware } from '../../../shared/state/middleware.log.js'
import { rootReducer } from '../../../shared/state/reducer.root.js'
import { busMiddleware } from '../../shared/state/middleware.bus.js'
import { pickerMiddleware } from './middleware.js'

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false })
      .prepend(channelInjectorMiddleware(Channel.PICKER))
      .concat(busMiddleware(Channel.PICKER))
      .concat(pickerMiddleware())
      .concat(logMiddleware()),
  reducer: rootReducer,
})

/**
 * Listen for all actions from main
 */
globalThis.electron.receive(Channel.MAIN, (action: Action) => {
  store.dispatch(action)
})

export default store
