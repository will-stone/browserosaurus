import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  shallowEqual,
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from 'react-redux'

import { middleware } from './middleware'
import * as reducers from './reducer'

// Root Reducer
const rootReducer = combineReducers(reducers)
export type RootState = ReturnType<typeof rootReducer>

// Store
const store = configureStore({
  reducer: rootReducer,
  middleware: [middleware],
})

export default store

// useSelector hook wrapper includes typed state
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector
export const useShallowEqualSelector: TypedUseSelectorHook<RootState> = (
  selector,
) => useSelector(selector, shallowEqual)
