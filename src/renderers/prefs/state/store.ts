import type { AnyAction } from '@reduxjs/toolkit'

import { Channel } from '../../../shared/state/channels'
import createStore from '../../../shared/state/create-store'
import { customWindow } from '../../shared/custom.window'
import { busMiddleware } from '../../shared/state/middleware.bus'
import { prefsMiddleware } from './middleware'

const middleware = [busMiddleware(Channel.PREFS), prefsMiddleware()]

const store = createStore(Channel.PREFS, middleware)

/**
 * Listen for all actions
 */
customWindow.electron.receive(Channel.MAIN, (action: AnyAction) => {
  store.dispatch(action)
})

export default store
