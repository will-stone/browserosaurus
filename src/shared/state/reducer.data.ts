import { createReducer } from '@reduxjs/toolkit'

import { B_URL, CARROT_URL } from '../../config/CONSTANTS'
import { backspaceUrlParse } from '../utils/backspace-url-parse'
import {
  clickedBWebsiteButton,
  clickedDonate,
  clickedUrlBackspaceButton,
  gotAppVersion,
  gotDefaultBrowserStatus,
  prefsStarted,
  pressedBackspaceKey,
  tilesStarted,
  updateAvailable,
  updateDownloaded,
  updateDownloading,
  urlOpened,
} from './actions'

export interface Data {
  version: string
  updateStatus: 'available' | 'downloaded' | 'downloading' | 'no-update'
  isDefaultProtocolClient: boolean
  url: string
  tilesStarted: boolean
  prefsStarted: boolean
}

export const data = createReducer<Data>(
  {
    version: '',
    updateStatus: 'no-update',
    isDefaultProtocolClient: true,
    url: '',
    tilesStarted: false,
    prefsStarted: false,
  },
  (builder) =>
    builder
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
      .addCase(clickedBWebsiteButton, (state) => {
        state.url = B_URL
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
      }),
)
