import { createReducer } from '@reduxjs/toolkit'

import { CARROT_URL } from '../../config/CONSTANTS'
import { backspaceUrlParse } from '../utils/backspace-url-parse'
import {
  clickedDonate,
  clickedTabButton,
  gotAppVersion,
  gotDefaultBrowserStatus,
  pickerStarted,
  prefsStarted,
  pressedBackspaceKey,
  syncData,
  updateAvailable,
  updateDownloaded,
  updateDownloading,
  urlOpened,
} from './actions'

export type PrefsTab = 'about' | 'apps' | 'general'

export interface Data {
  version: string
  updateStatus: 'available' | 'downloaded' | 'downloading' | 'no-update'
  isDefaultProtocolClient: boolean
  url: string
  pickerStarted: boolean
  prefsStarted: boolean
  prefsTab: PrefsTab
}

const defaultData: Data = {
  version: '',
  updateStatus: 'no-update',
  isDefaultProtocolClient: true,
  url: '',
  pickerStarted: false,
  prefsStarted: false,
  prefsTab: 'general',
}

export const data = createReducer<Data>(defaultData, (builder) =>
  builder
    .addCase(syncData, (_, action) => action.payload)

    .addCase(pickerStarted, (state) => {
      state.pickerStarted = true
    })

    .addCase(prefsStarted, (state) => {
      state.prefsStarted = true
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
    }),
)
