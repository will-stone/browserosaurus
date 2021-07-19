import { createReducer } from '@reduxjs/toolkit'

import { syncApps } from './actions'

export interface App {
  name: string
  id: string
  urlTemplate?: string
  privateArg?: string
}

export const defaultApps: App[] = []

export const apps = createReducer<App[]>(defaultApps, (builder) =>
  builder.addCase(syncApps, (_, action) => action.payload),
)
