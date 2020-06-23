import electron from 'electron'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Browser } from '../../config/browsers'
import {
  APP_VERSION,
  BROWSERS_SCANNED,
  HIDDEN_TILE_IDS_RETRIEVED,
  PROTOCOL_STATUS,
  STORE_RETRIEVED,
  UPDATE_DOWNLOADED,
  URL_UPDATED,
} from '../../main/events'
import { Store as MainStore } from '../../main/store'
import { RENDERER_LOADED } from '../events'
import {
  receivedBrowsers,
  receivedDefaultProtocolClientStatus,
  receivedStore,
  receivedUpdate,
  receivedUrl,
  receivedVersion,
} from '../store/actions'
import Noop from './noop'

const TheMainListeners: React.FC = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    /**
     * Receive version
     * main -> renderer
     */
    electron.ipcRenderer.on(APP_VERSION, (_: unknown, string: string) => {
      dispatch(receivedVersion(string))
    })

    /**
     * Receive update availability
     * main -> renderer
     */
    electron.ipcRenderer.on(UPDATE_DOWNLOADED, () => {
      dispatch(receivedUpdate())
    })

    /**
     * Receive browsers
     * main -> renderer
     */
    electron.ipcRenderer.on(
      BROWSERS_SCANNED,
      (_: unknown, installedBrowsers: Browser[]) => {
        dispatch(receivedBrowsers(installedBrowsers))
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
    electron.ipcRenderer.on(PROTOCOL_STATUS, (_: unknown, bool: boolean) => {
      dispatch(receivedDefaultProtocolClientStatus(bool))
    })

    /**
     * Tell main that App component has mounted
     * renderer -> main
     */
    electron.ipcRenderer.send(RENDERER_LOADED)

    return function cleanup() {
      electron.ipcRenderer.removeAllListeners(APP_VERSION)
      electron.ipcRenderer.removeAllListeners(UPDATE_DOWNLOADED)
      electron.ipcRenderer.removeAllListeners(BROWSERS_SCANNED)
      electron.ipcRenderer.removeAllListeners(URL_UPDATED)
      electron.ipcRenderer.removeAllListeners(PROTOCOL_STATUS)
      electron.ipcRenderer.removeAllListeners(HIDDEN_TILE_IDS_RETRIEVED)
    }
  }, [dispatch])

  return <Noop />
}

export default TheMainListeners
