import createStore from '../../shared/state/create-store'
import { storage } from '../storage'
import { actionHubMiddleware } from './middleware.action-hub'
import { busMiddleware } from './middleware.bus'

const middleware = [busMiddleware(), actionHubMiddleware()]
const initialPartialState = { storage: storage.getAll() }

const { dispatch } = createStore(middleware, initialPartialState)

export { dispatch }
