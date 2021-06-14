import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'

import { apps } from './apps.reducer'
import { data } from './data.reducer'
import { storage } from './storage.reducer'
import { theme } from './theme.reducer'

export const rootReducer = combineReducers({ data, storage, apps, theme })

export type RootState = ReturnType<typeof rootReducer>

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
