import { createReducer } from '@reduxjs/toolkit'

import { CARROT_URL } from '../../config/CONSTANTS'
import { backspaceUrlParse } from '../utils/backspace-url-parse'
import {
  clickedDonate,
  clickedTabButton,
  clickedUpdateAvailableButton,
  clickedUrlBackspaceButton,
  gotAppVersion,
  gotDefaultBrowserStatus,
  prefsStarted,
  pressedBackspaceKey,
  syncData,
  tilesStarted,
  updateAvailable,
  updateDownloaded,
  updateDownloading,
  urlOpened,
} from './actions'

export type PrefsTab = 'about' | 'general' | 'tiles'

export interface Data {
  version: string
  updateStatus: 'available' | 'downloaded' | 'downloading' | 'no-update'
  isDefaultProtocolClient: boolean
  url: string
  tilesStarted: boolean
  prefsStarted: boolean
  prefsTab: PrefsTab
}

export const defaultData: Data = {
  version: '',
  updateStatus: 'no-update',
  isDefaultProtocolClient: true,
  url: '',
  tilesStarted: false,
  prefsStarted: false,
  prefsTab: 'general',
}

export const data = createReducer<Data>(defaultData, (builder) =>
  builder
    .addCase(syncData, (_, action) => action.payload)

    .addCase(tilesStarted, (state) => {
      state.tilesStarted = true
    })

    .addCase(prefsStarted, (state) => {
      state.prefsStarted = true
    })

    .addCase(clickedUrlBackspaceButton, (state) => {
      state.url = backspaceUrlParse(state.url)
    })

    .addCase(pressedBackspaceKey, (state) => {
      state.url = backspaceUrlParse(state.url)
    })

    .addCase(gotDefaultBrowserStatus, (state, action) => {
      state.isDefaultProtocolClient = action.payload
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

    .addCase(urlOpened, (state, action) => {
      state.url = action.payload
    })

    .addCase(gotAppVersion, (state, action) => {
      state.version = action.payload
    })

    .addCase(clickedDonate, (state) => {
      state.url = CARROT_URL
    })

    .addCase(clickedTabButton, (state, action) => {
      state.prefsTab = action.payload
    })

    .addCase(clickedUpdateAvailableButton, (state) => {
      state.prefsTab = 'general'
    }),
)
