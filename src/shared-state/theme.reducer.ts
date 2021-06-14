import { createReducer } from '@reduxjs/toolkit'

import { gotTheme } from './actions'

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
    builder.addCase(gotTheme, (_, action) => action.payload)
  },
)
