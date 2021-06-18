import createStore from '../shared-state/createStore'
import { actionHubMiddleware } from './action-hub.middleware'
import { busMiddleware } from './bus.middleware'

const { dispatch } = createStore([busMiddleware(), actionHubMiddleware()])

export { dispatch }
