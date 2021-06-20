import { createReducer } from '@reduxjs/toolkit'

import { syncTheme } from './actions'

export interface ThemeState {
  isDarkMode: boolean
  accent: string
}

export const theme = createReducer<ThemeState>(
  {
    isDarkMode: false,
    accent: '',
  },
  (builder) => {
    builder.addCase(syncTheme, (_, action) => action.payload)
  },
)
