import type { AnyAction, ThunkAction } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'

import { data, defaultData } from './reducer.data'
import { defaultStorage, storage } from './reducer.storage'

export const rootReducer = combineReducers({ data, storage })

export type RootState = ReturnType<typeof rootReducer>

export const defaultState: RootState = {
  data: defaultData,
  storage: defaultStorage,
}

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>
