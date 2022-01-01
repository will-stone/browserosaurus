import { Channel } from '../../shared/state/channels'
import createStore from '../../shared/state/create-store'
import { database } from '../database'
import { actionHubMiddleware } from './middleware.action-hub'
import { busMiddleware } from './middleware.bus'

const middleware = [busMiddleware(), actionHubMiddleware()]

const { dispatch } = createStore(Channel.MAIN, middleware, {
  storage: database.getAll(),
})

export { dispatch }
