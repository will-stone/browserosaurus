import { createReducer } from '@reduxjs/toolkit'
import xor from 'lodash/xor'

import { DEFAULT_URL, SPONSOR_URL } from '../../config/CONSTANTS'
import { App } from '../../config/types'
import { Store as MainStore } from '../../main/store'
import { alterHotkeys } from '../../utils/alterHotkeys'
import { backspaceUrlParse } from '../../utils/backspaceUrlParse'
import {
  changedHotkey,
  clickedCloseMenuButton,
  clickedEyeButton,
  clickedFavButton,
  clickedSettingsButton,
  clickedSponsorButton,
  clickedUrlBackspaceButton,
  clickedVersionButton,
  pressedBackspaceKey,
  pressedEscapeKey,
  receivedApps,
  receivedDefaultProtocolClientStatus,
  receivedStore,
  receivedTheme,
  receivedUpdateAvailable,
  receivedUpdateDownloaded,
  receivedUrl,
  receivedVersion,
} from './actions'

/**
 * Apps Reducer
 */
const apps = createReducer<App[]>([], (builder) =>
  builder.addCase(receivedApps, (_, action) => action.payload),
)

/**
 * Theme Reducer
 */
export interface ThemeState {
  shouldUseDarkColors: boolean
  accent: string
}

const theme = createReducer<ThemeState>(
  {
    shouldUseDarkColors: false,
    accent: '',
  },
  (builder) => {
    builder.addCase(receivedTheme, (_, action) => action.payload)
  },
)

/**
 * UI Reducer
 */
interface UiState {
  editMode: boolean
  url: string
  version: string
  updateStatus: 'no-update' | 'available' | 'downloaded'
  isDefaultProtocolClient: boolean

  // From main's store
  fav: MainStore['fav']
  hiddenTileIds: MainStore['hiddenTileIds']
  hotkeys: MainStore['hotkeys']
}

const ui = createReducer<UiState>(
  {
    editMode: false,
    version: '',
    updateStatus: 'no-update',
    isDefaultProtocolClient: true,
    url: DEFAULT_URL,

    // From main's store
    fav: '',
    hiddenTileIds: [],
    hotkeys: {},
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
        state.editMode = false
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
        state.editMode = true
      })
      .addCase(clickedUrlBackspaceButton, (state) => {
        state.url = backspaceUrlParse(state.url)
      })
      .addCase(clickedSponsorButton, (state) => {
        state.url = SPONSOR_URL
        state.editMode = false
      })
      .addCase(clickedVersionButton, (state) => {
        state.url = DEFAULT_URL
        state.editMode = false
      })
      .addCase(pressedEscapeKey, (state) => {
        if (state.editMode) {
          state.editMode = false
        }
      })
      .addCase(pressedBackspaceKey, (state) => {
        state.url = backspaceUrlParse(state.url)
      })
      .addCase(receivedDefaultProtocolClientStatus, (state, action) => {
        state.isDefaultProtocolClient = action.payload
      })
      .addCase(receivedStore, (state, action) => {
        state.fav = action.payload.fav
        state.hiddenTileIds = action.payload.hiddenTileIds
        state.hotkeys = action.payload.hotkeys
      })
      .addCase(receivedUpdateAvailable, (state) => {
        state.updateStatus = 'available'
      })
      .addCase(receivedUpdateDownloaded, (state) => {
        state.updateStatus = 'downloaded'
      })
      .addCase(receivedUrl, (state, action) => {
        state.editMode = false
        state.url = action.payload
      })
      .addCase(receivedVersion, (state, action) => {
        state.version = action.payload
      }),
)

export { apps, theme, ui }
