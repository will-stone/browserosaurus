import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit'
import electron from 'electron'
import deepEqual from 'fast-deep-equal'
import {
  shallowEqual,
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from 'react-redux'

import { App, Profile } from '../../config/types'
import {
  APP_VERSION,
  AVAILABLE_PROFILES_FOUND,
  INSTALLED_APPS_FOUND,
  PROTOCOL_STATUS_RETRIEVED,
  STORE_RETRIEVED,
  UPDATE_AVAILABLE,
  UPDATE_DOWNLOADED,
  URL_UPDATED,
} from '../../main/events'
import { Store as MainStore } from '../../main/store'
import {
  appStarted,
  receivedApps,
  receivedDefaultProtocolClientStatus,
  receivedProfiles,
  receivedStore,
  receivedUpdateAvailable,
  receivedUpdateDownloaded,
  receivedUrl,
  receivedVersion,
} from './actions'
import { onStateChangeMiddleware } from './on-state-change.middleware'
import * as reducers from './reducers'

// Root Reducer
const rootReducer = combineReducers(reducers)
export type RootState = ReturnType<typeof rootReducer>

// Store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(onStateChangeMiddleware()),
})

export default store

// useSelector hook wrapper includes typed state
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector
export const useShallowEqualSelector: TypedUseSelectorHook<RootState> = (
  selector,
) => useSelector(selector, shallowEqual)
export const useDeepEqualSelector: TypedUseSelectorHook<RootState> = (
  selector,
) => useSelector(selector, deepEqual)

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

// -----------------------------------------------------------------------------
// Main event listeners
// -----------------------------------------------------------------------------

/**
 * Receive version
 * main -> renderer
 */
electron.ipcRenderer.on(APP_VERSION, (_: unknown, version: string) => {
  store.dispatch(receivedVersion(version))
})

/**
 * Receive update available
 * main -> renderer
 */
electron.ipcRenderer.on(UPDATE_AVAILABLE, () => {
  store.dispatch(receivedUpdateAvailable())
})

/**
 * Receive update downloaded
 * main -> renderer
 */
electron.ipcRenderer.on(UPDATE_DOWNLOADED, () => {
  store.dispatch(receivedUpdateDownloaded())
})

/**
 * Receive apps
 * main -> renderer
 */
electron.ipcRenderer.on(
  INSTALLED_APPS_FOUND,
  (_: unknown, installedApps: App[]) => {
    store.dispatch(receivedApps(installedApps))
  },
)

/**
 * Receive profiles
 * main -> renderer
 */
electron.ipcRenderer.on(
  AVAILABLE_PROFILES_FOUND,
  (_: unknown, profiles: Profile[]) => {
    store.dispatch(receivedProfiles(profiles))
  },
)

/**
 * Receive URL
 * main -> renderer
 */
electron.ipcRenderer.on(URL_UPDATED, (_: unknown, url: string) => {
  store.dispatch(receivedUrl(url))
})

/**
 * Receive main's store
 * main -> renderer
 */
electron.ipcRenderer.on(STORE_RETRIEVED, (_: unknown, mainStore: MainStore) => {
  store.dispatch(receivedStore(mainStore))
})

/**
 * Receive protocol status
 * main -> renderer
 */
electron.ipcRenderer.on(
  PROTOCOL_STATUS_RETRIEVED,
  (_: unknown, bool: boolean) => {
    store.dispatch(receivedDefaultProtocolClientStatus(bool))
  },
)

/*
 * Tell main that renderer has started
 */
store.dispatch(appStarted())
