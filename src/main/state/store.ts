import { Channel } from '../../shared/state/channels'
import createStore from '../../shared/state/create-store'
import { storage } from '../storage'
import { actionHubMiddleware } from './middleware.action-hub'
import { busMiddleware } from './middleware.bus'

const middleware = [busMiddleware(), actionHubMiddleware()]

const { dispatch } = createStore(Channel.MAIN, middleware, {
  storage: storage.getAll(),
})

export { dispatch }
