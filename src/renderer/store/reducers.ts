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
  textBackground: string
  windowBackground: string
  controlBackground: string
  control: string
}

const theme = createReducer<ThemeState>(
  {
    textBackground: '',
    windowBackground: '',
    controlBackground: '',
    control: '',
  },
  (builder) => {
    builder.addCase(receivedTheme, (_, action) => action.payload)
  },
)

/**
 * UI Reducer
 */
interface UiState {
  menu: false | 'tiles'
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
    menu: false,
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
        state.menu = false
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
        if (state.menu) {
          state.menu = false
        } else {
          state.menu = 'tiles'
        }
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
        if (state.menu === 'tiles') {
          state.menu = false
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
        state.menu = false
        state.url = action.payload
      })
      .addCase(receivedVersion, (state, action) => {
        state.version = action.payload
      }),
)

export { apps, theme, ui }
