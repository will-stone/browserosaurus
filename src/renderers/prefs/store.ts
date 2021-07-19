import type { AnyAction } from '@reduxjs/toolkit'

import { Channel } from '../../shared/state/channels'
import createStore from '../../shared/state/create-store'
import { customWindow } from '../shared/custom.window'
import { busMiddleware } from '../shared/state/middleware.bus'

const store = createStore([busMiddleware(Channel.PREFS)])

export default store

/**
 * Listen for all actions
 */
customWindow.electron.receive(Channel.MAIN, (action: AnyAction) => {
  store.dispatch(action)
})
