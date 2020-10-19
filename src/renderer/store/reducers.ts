import { createReducer } from '@reduxjs/toolkit'

import { DEFAULT_URL, SPONSOR_URL } from '../../config/CONSTANTS'
import { App } from '../../config/types'
import { Store as MainStore } from '../../main/store'
import { alterHotkeys } from '../../utils/alterHotkeys'
import { backspaceUrlParse } from '../../utils/backspaceUrlParse'
import {
  appStarted,
  changedHotkey,
  clickedCloseMenuButton,
  clickedEyeButton,
  clickedFavButton,
  clickedSetAsDefaultButton,
  clickedSettingsButton,
  clickedSponsorButton,
  clickedThemeButton,
  clickedUrlBackspaceButton,
  clickedVersionButton,
  pressedBackspaceKey,
  pressedEscapeKey,
  receivedApps,
  receivedDefaultProtocolClientStatus,
  receivedStore,
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
 * UI Reducer
 */
interface UiState {
  appStarted: boolean
  menu: false | 'tiles'
  url: string
  version: string
  updateStatus: 'no-update' | 'available' | 'downloaded'
  isDefaultProtocolClient: boolean

  // From main's store
  fav: MainStore['fav']
  hiddenTileIds: MainStore['hiddenTileIds']
  hotkeys: MainStore['hotkeys']
  theme: MainStore['theme']
}

const ui = createReducer<UiState>(
  {
    appStarted: false,
    menu: false,
    version: '',
    updateStatus: 'no-update',
    isDefaultProtocolClient: true,
    url: DEFAULT_URL,

    // From main's store
    fav: '',
    hiddenTileIds: [],
    hotkeys: {},
    theme: 'dark',
  },
  (builder) =>
    builder
      .addCase(appStarted, (state) => {
        state.appStarted = true
      })
      .addCase(changedHotkey, (state, action) => {
        const updatedHotkeys = alterHotkeys(
          state.hotkeys,
          action.payload.appId,
          action.payload.value,
        )
        state.hotkeys = updatedHotkeys
      })
      .addCase(clickedCloseMenuButton, (state) => {
        state.menu = false
      })
      .addCase(clickedEyeButton, (state, action) => {
        const { hiddenTileIds } = state
        // Remove the id if it exists in the array
        const updatedHiddenTileIds = hiddenTileIds.filter(
          (id) => id !== action.payload,
        )

        // If no id was removed, it didn't exist to begin with and should be added
        if (updatedHiddenTileIds.length === hiddenTileIds.length) {
          updatedHiddenTileIds.push(action.payload)
        }

        state.hiddenTileIds = updatedHiddenTileIds
      })
      .addCase(clickedFavButton, (state, action) => {
        state.fav = action.payload
      })
      .addCase(clickedSettingsButton, (state) => {
        if (state.menu) {
          state.menu = false
        } else {
          state.menu = 'tiles'
        }
      })
      .addCase(clickedSetAsDefaultButton, (state) => {
        state.menu = false
      })
      .addCase(clickedThemeButton, (state, action) => {
        state.theme = action.payload
      })
      .addCase(clickedUrlBackspaceButton, (state) => {
        state.url = backspaceUrlParse(state.url)
      })
      .addCase(clickedSponsorButton, (state) => {
        state.url = SPONSOR_URL
        state.menu = false
      })
      .addCase(clickedVersionButton, (state) => {
        state.url = DEFAULT_URL
        state.menu = false
      })
      .addCase(pressedEscapeKey, (state) => {
        state.menu = false
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
        state.theme = action.payload.theme
      })
      .addCase(receivedUpdateAvailable, (state) => {
        state.updateStatus = 'available'
      })
      .addCase(receivedUpdateDownloaded, (state) => {
        state.updateStatus = 'downloaded'
      })
      .addCase(receivedUrl, (state, action) => {
        state.menu = false
        state.url = action.payload
      })
      .addCase(receivedVersion, (state, action) => {
        state.version = action.payload
      }),
)

export { apps, ui }
