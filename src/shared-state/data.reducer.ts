import { createReducer } from '@reduxjs/toolkit'

import { B_URL, CARROT_URL } from '../config/CONSTANTS'
import { backspaceUrlParse } from '../utils/backspaceUrlParse'
import {
  clickedBWebsiteButton,
  clickedDonate,
  clickedUrlBackspaceButton,
  gotAppVersion,
  gotDefaultBrowserStatus,
  pressedBackspaceKey,
  updateAvailable,
  updateDownloaded,
  updateDownloading,
  urlUpdated,
} from './actions'

export interface Data {
  version: string
  updateStatus: 'available' | 'downloaded' | 'downloading' | 'no-update'
  isDefaultProtocolClient: boolean
  url: string
}

export const data = createReducer<Data>(
  {
    version: '',
    updateStatus: 'no-update',
    isDefaultProtocolClient: true,
    url: '',
  },
  (builder) =>
    builder
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
      .addCase(urlUpdated, (state, action) => {
        state.url = action.payload
      })
      .addCase(gotAppVersion, (state, action) => {
        state.version = action.payload
      })
      .addCase(clickedDonate, (state) => {
        state.url = CARROT_URL
      }),
)
