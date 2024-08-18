/* eslint-disable unicorn/prefer-spread -- see https://redux-toolkit.js.org/api/getDefaultMiddleware#intended-usage */

import type { UnknownAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'

import { Channel } from '../../../shared/state/channels'
import { channelInjectorMiddleware } from '../../../shared/state/middleware.channel-injector'
import { logMiddleware } from '../../../shared/state/middleware.log'
import { rootReducer } from '../../../shared/state/reducer.root'
import { busMiddleware } from '../../shared/state/middleware.bus'
import { prefsMiddleware } from './middleware'

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
