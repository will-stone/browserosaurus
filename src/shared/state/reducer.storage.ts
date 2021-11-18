import { createReducer } from '@reduxjs/toolkit'

import type { AppId } from '../../config/apps'
import {
  changedHotkey,
  clickedDonate,
  clickedMaybeLater,
  installedAppsRetrieved,
  pickerWindowBoundsChanged,
  reorderedApps,
  syncStorage,
} from './actions'

export interface Storage {
  apps: { id: AppId; hotkey: string | null }[]
  supportMessage: number
  firstRun: boolean
  height: number
}

export const defaultStorage: Storage = {
  apps: [],
  supportMessage: 0,
  firstRun: true,
  height: 204,
}

export const storage = createReducer<Storage>(defaultStorage, (builder) =>
  builder
    .addCase(syncStorage, (state, action) => action.payload)

    .addCase(installedAppsRetrieved, (state, action) => {
      const installedAppIds = action.payload

      const installedStoredApps = state.apps.filter((storedApp) =>
        installedAppIds.includes(storedApp.id),
      )

      const notStoredInstalledApps = installedAppIds
        .filter(
          (id) =>
            !installedStoredApps
              .map((installedStoredApp) => installedStoredApp.id)
              .includes(id),
        )
        .map((id) => ({ id, hotkey: null }))

      state.apps = [...installedStoredApps, ...notStoredInstalledApps]
    })

    .addCase(changedHotkey, (state, action) => {
      const lowerHotkey = action.payload.value.toLowerCase()
      const appWithSameHotkeyIndex = state.apps.findIndex(
        (app) => app.hotkey === lowerHotkey,
      )

      if (appWithSameHotkeyIndex > -1) {
        state.apps[appWithSameHotkeyIndex].hotkey = null
      }

      const appIndex = state.apps.findIndex(
        (app) => app.id === action.payload.appId,
      )

      state.apps[appIndex].hotkey = lowerHotkey
    })

    .addCase(clickedDonate, (state) => {
      state.supportMessage = -1
    })

    .addCase(clickedMaybeLater, (state) => {
      state.supportMessage = Date.now()
    })

    .addCase(pickerWindowBoundsChanged, (state, action) => {
      state.height = action.payload.height
    })

    .addCase(reorderedApps, (state, action) => {
      const [removed] = state.apps.splice(action.payload.source, 1)
      state.apps.splice(action.payload.destination, 0, removed)
    }),
)
