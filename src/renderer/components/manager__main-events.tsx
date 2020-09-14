import electron from 'electron'
import React, { useEffect } from 'react'

import { App } from '../../config/types'
import {
  APP_VERSION,
  INSTALLED_APPS_FOUND,
  PROTOCOL_STATUS_RETRIEVED,
  STORE_RETRIEVED,
  UPDATE_AVAILABLE,
  UPDATE_DOWNLOADED,
  URL_UPDATED,
} from '../../main/events'
import { Store as MainStore } from '../../main/store'
import { events } from '../store'
import Noop from './atoms/noop'

const {
  appStarted,
  receivedApps,
  receivedDefaultProtocolClientStatus,
  receivedStore,
  receivedUpdateAvailable,
  receivedUpdateDownloaded,
  receivedUrl,
  receivedVersion,
} = events

const MainEventsManager: React.FC = () => {
  useEffect(() => {
    /**
     * Receive version
     * main -> renderer
     */
    electron.ipcRenderer.on(APP_VERSION, (_: unknown, string: string) => {
      receivedVersion(string)
    })

    /**
     * Receive update available
     * main -> renderer
     */
    electron.ipcRenderer.on(UPDATE_AVAILABLE, () => {
      receivedUpdateAvailable()
    })

    /**
     * Receive update downloaded
     * main -> renderer
     */
    electron.ipcRenderer.on(UPDATE_DOWNLOADED, () => {
      receivedUpdateDownloaded()
    })

    /**
     * Receive apps
     * main -> renderer
     */
    electron.ipcRenderer.on(
      INSTALLED_APPS_FOUND,
      (_: unknown, installedApps: App[]) => {
        receivedApps(installedApps)
      },
    )

    /**
     * Receive URL
     * main -> renderer
     */
    electron.ipcRenderer.on(URL_UPDATED, (_: unknown, url: string) => {
      receivedUrl(url)
    })

    /**
     * Receive main's store
     * main -> renderer
     */
    electron.ipcRenderer.on(STORE_RETRIEVED, (_: unknown, store: MainStore) => {
      receivedStore(store)
    })

    /**
     * Receive protocol status
     * main -> renderer
     */
    electron.ipcRenderer.on(
      PROTOCOL_STATUS_RETRIEVED,
      (_: unknown, bool: boolean) => {
        receivedDefaultProtocolClientStatus(bool)
      },
    )

    /**
     * Tell main that App component has mounted
     * renderer -> main
     */
    appStarted()

    return function cleanup() {
      electron.ipcRenderer.removeAllListeners(APP_VERSION)
      electron.ipcRenderer.removeAllListeners(UPDATE_DOWNLOADED)
      electron.ipcRenderer.removeAllListeners(INSTALLED_APPS_FOUND)
      electron.ipcRenderer.removeAllListeners(URL_UPDATED)
      electron.ipcRenderer.removeAllListeners(PROTOCOL_STATUS_RETRIEVED)
      electron.ipcRenderer.removeAllListeners(STORE_RETRIEVED)
    }
  }, [])

  return <Noop />
}

export default MainEventsManager
