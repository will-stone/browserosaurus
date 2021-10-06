import { createReducer } from '@reduxjs/toolkit'

import type { AppId } from '../../config/apps'
import { syncAppIds } from './actions'

export const defaultAppIds: AppId[] = []

export const appIds = createReducer<AppId[]>(defaultAppIds, (builder) =>
  builder.addCase(syncAppIds, (_, action) => action.payload),
)
