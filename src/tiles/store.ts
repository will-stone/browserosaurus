import type { AnyAction } from '@reduxjs/toolkit'
import { ipcRenderer } from 'electron'

import { busMiddleware } from '../renderers/bus.middleware'
import { Channel } from '../shared-state/channels'
import createStore from '../shared-state/createStore'

const store = createStore([busMiddleware(Channel.TILES)])

export default store

/**
 * Listen for all actions from main
 */
ipcRenderer.on(Channel.MAIN, (_: unknown, action: AnyAction) => {
  store.dispatch(action)
})
