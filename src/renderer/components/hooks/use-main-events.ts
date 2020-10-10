import { createAction } from '@reduxjs/toolkit'
import electron from 'electron'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { App } from '../../../config/types'
import {
  APP_VERSION,
  INSTALLED_APPS_FOUND,
  PROTOCOL_STATUS_RETRIEVED,
  STORE_RETRIEVED,
  UPDATE_AVAILABLE,
  UPDATE_DOWNLOADED,
  URL_UPDATED,
} from '../../../main/events'
import { Store as MainStore } from '../../../main/store'
import { startRenderer } from '../../sendToMain'

export const receivedStore = createAction<MainStore>('main/receivedStore')
export const receivedApps = createAction<App[]>('main/receivedApps')
export const receivedVersion = createAction<string>('main/receivedVersion')
export const receivedUpdateAvailable = createAction(
  'main/receivedUpdateAvailable',
)
export const receivedUpdateDownloaded = createAction(
  'main/receivedUpdateDownloaded',
)
export const receivedUrl = createAction<string>('main/receivedUrl')
export const receivedDefaultProtocolClientStatus = createAction<boolean>(
  'main/receivedDefaultProtocolClientStatus',
)

export const useMainEvents = (): void => {
  const dispatch = useDispatch()

  useEffect(() => {
    /**
     * Receive version
     * main -> renderer
     */
    electron.ipcRenderer.on(APP_VERSION, (_: unknown, version: string) => {
      dispatch(receivedVersion(version))
    })

    /**
     * Receive update available
     * main -> renderer
     */
    electron.ipcRenderer.on(UPDATE_AVAILABLE, () => {
      dispatch(receivedUpdateAvailable())
    })

    /**
     * Receive update downloaded
     * main -> renderer
     */
    electron.ipcRenderer.on(UPDATE_DOWNLOADED, () => {
      dispatch(receivedUpdateDownloaded())
    })

    /**
     * Receive apps
     * main -> renderer
     */
    electron.ipcRenderer.on(
      INSTALLED_APPS_FOUND,
      (_: unknown, installedApps: App[]) => {
        dispatch(receivedApps(installedApps))
      },
    )

    /**
     * Receive URL
     * main -> renderer
     */
    electron.ipcRenderer.on(URL_UPDATED, (_: unknown, url: string) => {
      dispatch(receivedUrl(url))
    })

    /**
     * Receive main's store
     * main -> renderer
     */
    electron.ipcRenderer.on(STORE_RETRIEVED, (_: unknown, store: MainStore) => {
      dispatch(receivedStore(store))
    })

    /**
     * Receive protocol status
     * main -> renderer
     */
    electron.ipcRenderer.on(
      PROTOCOL_STATUS_RETRIEVED,
      (_: unknown, bool: boolean) => {
        dispatch(receivedDefaultProtocolClientStatus(bool))
      },
    )

    /**
     * Tell main that App component has mounted
     * renderer -> main
     */
    startRenderer()

    return function cleanup() {
      electron.ipcRenderer.removeAllListeners(APP_VERSION)
      electron.ipcRenderer.removeAllListeners(UPDATE_AVAILABLE)
      electron.ipcRenderer.removeAllListeners(UPDATE_DOWNLOADED)
      electron.ipcRenderer.removeAllListeners(INSTALLED_APPS_FOUND)
      electron.ipcRenderer.removeAllListeners(URL_UPDATED)
      electron.ipcRenderer.removeAllListeners(STORE_RETRIEVED)
      electron.ipcRenderer.removeAllListeners(PROTOCOL_STATUS_RETRIEVED)
    }
  }, [dispatch])
}
