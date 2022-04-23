import { createReducer } from '@reduxjs/toolkit'

import type { AppId } from '../../config/apps'
import {
  changedPickerWindowBounds,
  readiedApp,
  receivedRendererStartupSignal,
  retrievedInstalledApps,
} from '../../main/state/actions'
import {
  clickedDonate,
  clickedMaybeLater,
} from '../../renderers/picker/state/actions'
import {
  confirmedReset,
  reorderedApp,
  updatedHotCode,
} from '../../renderers/prefs/state/actions'

export interface Storage {
  apps: { id: AppId; hotCode: string | null; isInstalled: boolean }[]
  supportMessage: number
  isSetup: boolean
  height: number
}

export const defaultStorage: Storage = {
  apps: [],
  supportMessage: 0,
  isSetup: false,
  height: 200,
}

export const storage = createReducer<Storage>(defaultStorage, (builder) =>
  builder
    .addCase(readiedApp, (state) => {
      state.isSetup = true
    })

    .addCase(confirmedReset, () => defaultStorage)

    .addCase(
      receivedRendererStartupSignal,
      (_, action) => action.payload.storage,
    )

    .addCase(retrievedInstalledApps, (state, action) => {
      const installedAppIds = action.payload

      for (const storedApp of state.apps) {
        storedApp.isInstalled = installedAppIds.includes(storedApp.id)
      }

      for (const installedAppId of installedAppIds) {
        const installedAppInStorage = state.apps.some(
          ({ id }) => id === installedAppId,
        )

        if (!installedAppInStorage) {
          state.apps.push({
            id: installedAppId,
            hotCode: null,
            isInstalled: true,
          })
        }
      }
    })

    .addCase(updatedHotCode, (state, action) => {
      const hotCode = action.payload.value

      const appWithSameHotCodeIndex = state.apps.findIndex(
        (app) => app.hotCode === hotCode,
      )

      if (appWithSameHotCodeIndex > -1) {
        state.apps[appWithSameHotCodeIndex].hotCode = null
      }

      const appIndex = state.apps.findIndex(
        (app) => app.id === action.payload.appId,
      )

      state.apps[appIndex].hotCode = hotCode
    })

    .addCase(clickedDonate, (state) => {
      state.supportMessage = -1
    })

    .addCase(clickedMaybeLater, (state) => {
      state.supportMessage = Date.now()
    })

    .addCase(changedPickerWindowBounds, (state, action) => {
      state.height = action.payload.height
    })

    .addCase(reorderedApp, (state, action) => {
      const sourceIndex = state.apps.findIndex(
        (app) => app.id === action.payload.sourceId,
      )

      const destinationIndex = state.apps.findIndex(
        (app) => app.id === action.payload.destinationId,
      )

      const [removed] = state.apps.splice(sourceIndex, 1)
      state.apps.splice(destinationIndex, 0, removed)
    }),
)
