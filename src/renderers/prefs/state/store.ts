/* eslint-disable unicorn/prefer-spread -- see https://redux-toolkit.js.org/api/getDefaultMiddleware#intended-usage */

import type { UnknownAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'

import { Channel } from '../../../shared/state/channels.js'
import { channelInjectorMiddleware } from '../../../shared/state/middleware.channel-injector.js'
import { logMiddleware } from '../../../shared/state/middleware.log.js'
import { rootReducer } from '../../../shared/state/reducer.root.js'
import { busMiddleware } from '../../shared/state/middleware.bus.js'
import { prefsMiddleware } from './middleware.js'

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false })
      .prepend(channelInjectorMiddleware(Channel.PREFS))
      .concat(busMiddleware(Channel.PREFS))
      .concat(prefsMiddleware())
      .concat(logMiddleware()),
  reducer: rootReducer,
})

/**
 * Listen for all actions
 */
window.electron.receive(Channel.MAIN, (action: UnknownAction) => {
  store.dispatch(action)
})

export default store
