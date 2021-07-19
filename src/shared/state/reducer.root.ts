import type { AnyAction, ThunkAction } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'

import { apps, defaultApps } from './reducer.apps'
import { data, defaultData } from './reducer.data'
import { defaultStorage, storage } from './reducer.storage'

export const rootReducer = combineReducers({ data, storage, apps })

export type RootState = ReturnType<typeof rootReducer>

export const defaultState: RootState = {
  apps: defaultApps,
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
