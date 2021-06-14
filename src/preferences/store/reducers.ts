import { createReducer } from '@reduxjs/toolkit'

import {
  gotAppVersion,
  gotDefaultBrowserStatus,
  gotInstalledApps,
  gotStore,
  gotTheme,
  updateAvailable,
  updateDownloaded,
  updateDownloading,
} from '../../actions'
import { App } from '../../config/apps'
import { Store as MainStore } from '../../main/store'
import { ThemeState } from '../../model'

/**
 * Apps Reducer
 */
const apps = createReducer<App[]>([], (builder) =>
  builder.addCase(gotInstalledApps, (_, action) => action.payload),
)

const theme = createReducer<ThemeState>(
  {
    isDarkMode: false,
    accent: '',
  },
  (builder) => {
    builder.addCase(gotTheme, (_, action) => action.payload)
  },
)

/**
 * UI Reducer
 */
interface UiState {
  isEditMode: boolean
  version: string
  updateStatus: 'available' | 'downloaded' | 'downloading' | 'no-update'
  isDefaultProtocolClient: boolean

  // From main's store
  fav: MainStore['fav']
  hiddenTileIds: MainStore['hiddenTileIds']
  hotkeys: MainStore['hotkeys']
}

const ui = createReducer<UiState>(
  {
    isEditMode: false,
    version: '',
    updateStatus: 'no-update',
    isDefaultProtocolClient: true,

    // From main's store
    fav: '',
    hiddenTileIds: [],
    hotkeys: {},
  },
  (builder) =>
    builder
      .addCase(gotDefaultBrowserStatus, (state, action) => {
        state.isDefaultProtocolClient = action.payload
      })
      .addCase(gotStore, (state, action) => {
        state.fav = action.payload.fav
        state.hiddenTileIds = action.payload.hiddenTileIds
        state.hotkeys = action.payload.hotkeys
      })
      .addCase(updateAvailable, (state) => {
        state.updateStatus = 'available'
      })
      .addCase(updateDownloading, (state) => {
        state.updateStatus = 'downloading'
      })
      .addCase(updateDownloaded, (state) => {
        state.updateStatus = 'downloaded'
      })
      .addCase(gotAppVersion, (state, action) => {
        state.version = action.payload
      }),
)

export { apps, theme, ui }
