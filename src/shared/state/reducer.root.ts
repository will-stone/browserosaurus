import type { AnyAction, ThunkAction } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'

import { apps } from './reducer.apps'
import { data } from './reducer.data'
import { storage } from './reducer.storage'
import { theme } from './reducer.theme'

export const rootReducer = combineReducers({ data, storage, apps, theme })

export type RootState = ReturnType<typeof rootReducer>

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>
