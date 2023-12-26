import { createReducer } from '@reduxjs/toolkit'

import type { AppName } from '../../config/apps.js'
import { CARROT_URL } from '../../config/constants.js'
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
} from '../../main/state/actions.js'
import {
  clickedDonate,
  clickedUpdateBar,
  startedPicker,
} from '../../renderers/picker/state/actions.js'
import {
  clickedTabButton,
  confirmedReset,
  startedPrefs,
} from '../../renderers/prefs/state/actions.js'
import { gotKeyLayoutMap } from '../../renderers/shared/state/actions.js'

type PrefsTab = 'about' | 'apps' | 'general'

type Data = {
  version: string
  updateStatus: 'available' | 'downloaded' | 'downloading' | 'no-update'
  isDefaultProtocolClient: boolean
  url: string
  pickerStarted: boolean
  prefsStarted: boolean
  prefsTab: PrefsTab
  keyCodeMap: Record<string, string>
  scanStatus: 'init' | 'scanned' | 'scanning'
  icons: Partial<Record<AppName, string>>
  activeAppIndex: number
}

const defaultData: Data = {
  activeAppIndex: 0,
  icons: {},
  isDefaultProtocolClient: true,
  keyCodeMap: {},
  pickerStarted: false,
  prefsStarted: false,
  prefsTab: 'general',
  scanStatus: 'init',
  updateStatus: 'no-update',
  url: '',
  version: '',
}

const data = createReducer<Data>(defaultData, (builder) =>
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

export { Data, data, defaultData, PrefsTab }
