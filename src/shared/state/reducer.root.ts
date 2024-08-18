import type { ThunkAction } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'

import type { FSA } from './model'
import { data } from './reducer.data'
import { storage } from './reducer.storage'

const rootReducer = combineReducers({ data, storage })

type RootState = ReturnType<typeof rootReducer>

type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  undefined,
  FSA
>

export { AppThunk, rootReducer, RootState }
