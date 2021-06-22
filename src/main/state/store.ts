import createStore from '../../shared/state/create-store'
import { actionHubMiddleware } from './middleware.action-hub'
import { busMiddleware } from './middleware.bus'

const { dispatch } = createStore([busMiddleware(), actionHubMiddleware()])

export { dispatch }
