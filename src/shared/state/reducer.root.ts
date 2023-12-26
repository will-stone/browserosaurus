import type { ThunkAction } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'

import type { FSA } from './model.js'
import { data } from './reducer.data.js'
import { storage } from './reducer.storage.js'

const rootReducer = combineReducers({ data, storage })

type RootState = ReturnType<typeof rootReducer>

type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  undefined,
  FSA
>

export { AppThunk, rootReducer, RootState }
