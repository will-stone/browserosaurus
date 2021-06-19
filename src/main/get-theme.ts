import { nativeTheme, systemPreferences } from 'electron'

import { ThemeState } from '../shared-state/reducer.theme'

export function getTheme(): ThemeState {
  const theme = {
    // Is dark mode?
    isDarkMode: nativeTheme.shouldUseDarkColors,

    // Accent
    accent: `#${systemPreferences.getAccentColor()}`,
  }
  return theme
}
