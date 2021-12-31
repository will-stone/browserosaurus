import type { ThunkAction } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'

import type { FSA } from './model'
import { data } from './reducer.data'
import { storage } from './reducer.storage'

export const rootReducer = combineReducers({ data, storage })

export type RootState = ReturnType<typeof rootReducer>

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  undefined,
  FSA
>
