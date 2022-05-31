import { createReducer } from '@reduxjs/toolkit'

import type { AppId } from '../../config/apps'
import { CARROT_URL } from '../../config/CONSTANTS'
import {
  availableUpdate,
  downloadedUpdate,
  downloadingUpdate,
  gotAppIcons,
  gotDefaultBrowserStatus,
  openedUrl,
  receivedRendererStartupSignal,
  retrievedInstalledApps,
  startedScanning,
} from '../../main/state/actions'
import {
  clickedDonate,
  clickedUpdateBar,
  startedPicker,
} from '../../renderers/picker/state/actions'
import {
  clickedTabButton,
  confirmedReset,
  startedPrefs,
} from '../../renderers/prefs/state/actions'
import { gotKeyLayoutMap } from '../../renderers/shared/state/actions'

export type PrefsTab = 'about' | 'apps' | 'general'

export interface Data {
  version: string
  updateStatus: 'available' | 'downloaded' | 'downloading' | 'no-update'
  isDefaultProtocolClient: boolean
  url: string
  pickerStarted: boolean
  prefsStarted: boolean
  prefsTab: PrefsTab
  keyCodeMap: Record<string, string>
  scanStatus: 'init' | 'scanned' | 'scanning'
  icons: Partial<Record<AppId, string>>
}

export const defaultData: Data = {
  version: '',
  updateStatus: 'no-update',
  isDefaultProtocolClient: true,
  url: '',
  pickerStarted: false,
  prefsStarted: false,
  prefsTab: 'general',
  keyCodeMap: {},
  scanStatus: 'init',
  icons: {},
}

export const data = createReducer<Data>(defaultData, (builder) =>
  builder
    .addCase(receivedRendererStartupSignal, (_, action) => action.payload.data)

    .addCase(confirmedReset, () => defaultData)

    .addCase(startedScanning, (state) => {
      state.scanStatus = 'scanning'
    })

    .addCase(retrievedInstalledApps, (state) => {
      state.scanStatus = 'scanned'
    })

    .addCase(startedPicker, (state) => {
      state.pickerStarted = true
    })

    .addCase(startedPrefs, (state) => {
      state.prefsStarted = true
    })

    .addCase(gotDefaultBrowserStatus, (state, action) => {
      state.isDefaultProtocolClient = action.payload
    })

    .addCase(availableUpdate, (state) => {
      state.updateStatus = 'available'
    })

    .addCase(downloadingUpdate, (state) => {
      state.updateStatus = 'downloading'
    })

    .addCase(downloadedUpdate, (state) => {
      state.updateStatus = 'downloaded'
    })

    .addCase(openedUrl, (state, action) => {
      state.url = action.payload
    })

    .addCase(clickedDonate, (state) => {
      state.url = CARROT_URL
    })

    .addCase(clickedTabButton, (state, action) => {
      state.prefsTab = action.payload
    })

    .addCase(gotKeyLayoutMap, (state, action) => {
      state.keyCodeMap = action.payload
    })

    .addCase(gotAppIcons, (state, action) => {
      state.icons = action.payload
    })

    .addCase(clickedUpdateBar, (state) => {
      state.prefsTab = 'general'
    }),
)
