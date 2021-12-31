import { Channel } from '../../shared/state/channels'
import createStore from '../../shared/state/create-store'
import { actionHubMiddleware } from './middleware.action-hub'
import { busMiddleware } from './middleware.bus'

const middleware = [busMiddleware(), actionHubMiddleware()]

const { dispatch } = createStore(Channel.MAIN, middleware)

export { dispatch }
