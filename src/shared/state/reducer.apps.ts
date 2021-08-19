import { createReducer } from '@reduxjs/toolkit'

import { AppId } from '../../config/apps'
import { syncApps } from './actions'

export const defaultApps: AppId[] = []

export const apps = createReducer<AppId[]>(defaultApps, (builder) =>
  builder.addCase(syncApps, (_, action) => action.payload),
)
