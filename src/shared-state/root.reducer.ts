import { combineReducers } from '@reduxjs/toolkit'

import { apps } from './apps.reducer'
import { data } from './data.reducer'
import { storage } from './storage.reducer'
import { theme } from './theme.reducer'

export const rootReducer = combineReducers({ data, storage, apps, theme })
export type RootState = ReturnType<typeof rootReducer>
