import { Channel } from '../../shared/state/channels'
import createStore from '../../shared/state/create-store'
import { database } from '../database'
import { actionHubMiddleware } from './middleware.action-hub'
import { busMiddleware } from './middleware.bus'

const channel = Channel.MAIN
const middleware = [busMiddleware(), actionHubMiddleware()]
const preloadedState = { storage: database.getAll() }

const { dispatch } = createStore(channel, middleware, preloadedState)

export { dispatch }
