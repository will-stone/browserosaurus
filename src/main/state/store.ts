import { app } from 'electron'

import { Channel } from '../../shared/state/channels'
import createStore from '../../shared/state/create-store'
import { defaultData } from '../../shared/state/reducer.data'
import { type RootState } from '../../shared/state/reducer.root'
import { database } from '../database'
import { actionHubMiddleware } from './middleware.action-hub'
import { busMiddleware } from './middleware.bus'

const channel = Channel.MAIN
const middleware = [busMiddleware(), actionHubMiddleware()]

const preloadedState: RootState = {
  data: {
    ...defaultData,
    isDefaultProtocolClient: app.isDefaultProtocolClient('http'),
    version: `${app.getVersion()}${app.isPackaged ? '' : ' DEV'}`,
  },
  storage: database.getAll(),
}

const { dispatch, getState } = createStore(channel, middleware, preloadedState)

export { dispatch, getState }
