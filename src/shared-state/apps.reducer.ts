import { createReducer } from '@reduxjs/toolkit'

import { gotInstalledApps } from './actions'

export interface App {
  name: string
  id: string
  urlTemplate?: string
  privateArg?: string
}

export const apps = createReducer<App[]>([], (builder) =>
  builder.addCase(gotInstalledApps, (_, action) => action.payload),
)
