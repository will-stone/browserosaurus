import { createReducer } from '@reduxjs/toolkit'
import xor from 'lodash/xor'

import {
  changedHotkey,
  clickedAlreadyDonated,
  clickedBWebsiteButton,
  clickedCloseMenuButton,
  clickedDonate,
  clickedEyeButton,
  clickedFavButton,
  clickedMaybeLater,
  clickedSetAsDefaultBrowserButton,
  clickedSettingsButton,
  clickedUrlBackspaceButton,
  gotAppVersion,
  gotDefaultBrowserStatus,
  gotInstalledApps,
  gotStore,
  gotTheme,
  pressedBackspaceKey,
  pressedEscapeKey,
  updateAvailable,
  updateDownloaded,
  updateDownloading,
  urlUpdated,
} from '../../actions'
import type { App } from '../../config/apps'
import { B_URL, CARROT_URL } from '../../config/CONSTANTS'
import type { Store as MainStore } from '../../main/store'
import type { ThemeState } from '../../model'
import { alterHotkeys } from '../../utils/alterHotkeys'
import { backspaceUrlParse } from '../../utils/backspaceUrlParse'

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
  url: string
  version: string
  updateStatus: 'available' | 'downloaded' | 'downloading' | 'no-update'
  isDefaultProtocolClient: boolean

  // From main's store
  fav: MainStore['fav']
  hiddenTileIds: MainStore['hiddenTileIds']
  hotkeys: MainStore['hotkeys']
  supportMessage: MainStore['supportMessage']
}

const ui = createReducer<UiState>(
  {
    isEditMode: false,
    version: '',
    updateStatus: 'no-update',
    isDefaultProtocolClient: true,
    url: '',

    // From main's store
    fav: '',
    hiddenTileIds: [],
    hotkeys: {},
    // Hide by default to prevent flash of message on reload
    supportMessage: -1,
  },
  (builder) =>
    builder
      .addCase(changedHotkey, (state, action) => {
        const updatedHotkeys = alterHotkeys(
          state.hotkeys,
          action.payload.appId,
          action.payload.value,
        )
        state.hotkeys = updatedHotkeys
      })
      .addCase(clickedCloseMenuButton, (state) => {
        state.isEditMode = false
      })
      .addCase(clickedEyeButton, (state, action) => {
        const { hiddenTileIds } = state
        // Remove the id if it exists in the array, or add it if it doesn't
        state.hiddenTileIds = xor(hiddenTileIds, [action.payload])
      })
      .addCase(clickedFavButton, (state, action) => {
        state.fav = action.payload
      })
      .addCase(clickedSettingsButton, (state) => {
        state.isEditMode = true
      })
      .addCase(clickedUrlBackspaceButton, (state) => {
        state.url = backspaceUrlParse(state.url)
      })
      .addCase(clickedBWebsiteButton, (state) => {
        state.url = B_URL
        state.isEditMode = false
      })
      .addCase(pressedEscapeKey, (state) => {
        if (state.isEditMode) {
          state.isEditMode = false
        }
      })
      .addCase(pressedBackspaceKey, (state) => {
        state.url = backspaceUrlParse(state.url)
      })
      .addCase(gotDefaultBrowserStatus, (state, action) => {
        state.isDefaultProtocolClient = action.payload
      })
      .addCase(gotStore, (state, action) => {
        state.fav = action.payload.fav
        state.hiddenTileIds = action.payload.hiddenTileIds
        state.hotkeys = action.payload.hotkeys
        state.supportMessage = action.payload.supportMessage
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
      .addCase(urlUpdated, (state, action) => {
        state.isEditMode = false
        state.url = action.payload
      })
      .addCase(gotAppVersion, (state, action) => {
        state.version = action.payload
      })
      .addCase(clickedSetAsDefaultBrowserButton, (state) => {
        state.isEditMode = false
      })
      .addCase(clickedDonate, (state) => {
        state.url = CARROT_URL
        state.supportMessage = Date.now()
      })
      .addCase(clickedMaybeLater, (state) => {
        state.supportMessage = Date.now()
      })
      .addCase(clickedAlreadyDonated, (state) => {
        state.supportMessage = -1
      }),
)

export { apps, theme, ui }
