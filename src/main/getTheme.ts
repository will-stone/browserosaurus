import { nativeTheme, systemPreferences } from 'electron'

import { ThemeState } from '../shared-state/theme.reducer'

export function getTheme(): ThemeState {
  const theme = {
    // Is dark mode?
    isDarkMode: nativeTheme.shouldUseDarkColors,

    // Accent
    accent: `#${systemPreferences.getAccentColor()}`,
  }
  return theme
}
