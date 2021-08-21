import type { AnyAction, ThunkAction } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'

import { appIds, defaultAppIds } from './reducer.app-ids'
import { data, defaultData } from './reducer.data'
import { defaultStorage, storage } from './reducer.storage'

export const rootReducer = combineReducers({ data, storage, appIds })

export type RootState = ReturnType<typeof rootReducer>

export const defaultState: RootState = {
  appIds: defaultAppIds,
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
