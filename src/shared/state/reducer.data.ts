import { createReducer } from '@reduxjs/toolkit'

import type { AppId } from '../../config/apps'
import { CARROT_URL } from '../../config/CONSTANTS'
import {
  gotAppVersion,
  gotDefaultBrowserStatus,
  installedAppsRetrieved,
  syncReducers,
  updateAvailable,
  updateDownloaded,
  updateDownloading,
  urlOpened,
} from '../../main/state/actions'
import {
  clickedDonate,
  pickerStarted,
  pressedBackspaceKey,
} from '../../renderers/picker/state/actions'
import {
  clickedTabButton,
  prefsStarted,
} from '../../renderers/prefs/state/actions'
import { gotKeyLayoutMap } from '../../renderers/shared/state/actions'
import { backspaceUrlParse } from '../utils/backspace-url-parse'

export type PrefsTab = 'about' | 'apps' | 'general'

export interface Data {
  version: string
  updateStatus: 'available' | 'downloaded' | 'downloading' | 'no-update'
  isDefaultProtocolClient: boolean
  url: string
  pickerStarted: boolean
  prefsStarted: boolean
  prefsTab: PrefsTab
  installedApps: AppId[]
  keyCodeMap: Record<string, string>
}

export const defaultData: Data = {
  version: '',
  updateStatus: 'no-update',
  isDefaultProtocolClient: true,
  url: '',
  pickerStarted: false,
  prefsStarted: false,
  prefsTab: 'general',
  installedApps: [],
  keyCodeMap: {},
}

export const data = createReducer<Data>(defaultData, (builder) =>
  builder
    .addCase(syncReducers, (_, action) => action.payload.data)

    .addCase(installedAppsRetrieved, (state, action) => {
      state.installedApps = action.payload
    })

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
    })

    .addCase(gotKeyLayoutMap, (state, action) => {
      state.keyCodeMap = action.payload
    }),
)
