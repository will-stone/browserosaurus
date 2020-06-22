import electron from 'electron'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSetRecoilState } from 'recoil'

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
  browsersAtom,
  isDefaultBrowserAtom,
  isUpdateAvailableAtom,
  urlSelector,
  versionAtom,
} from '../state'
import { receivedStore } from '../store/actions'
import Noop from './noop'

const TheMainListeners: React.FC = () => {
  const dispatch = useDispatch()
  const setUrl = useSetRecoilState(urlSelector)
  const setBrowsersState = useSetRecoilState(browsersAtom)
  const setVersion = useSetRecoilState(versionAtom)
  const setUpdateAvailable = useSetRecoilState(isUpdateAvailableAtom)
  const setIsDefaultBrowser = useSetRecoilState(isDefaultBrowserAtom)

  useEffect(() => {
    /**
     * Receive version
     * main -> renderer
     */
    electron.ipcRenderer.on(APP_VERSION, (_: unknown, string: string) => {
      setVersion(string)
    })

    /**
     * Receive update availability
     * main -> renderer
     */
    electron.ipcRenderer.on(UPDATE_DOWNLOADED, () => {
      setUpdateAvailable(true)
    })

    /**
     * Receive browsers
     * main -> renderer
     */
    electron.ipcRenderer.on(
      BROWSERS_SCANNED,
      (_: unknown, installedBrowsers: Browser[]) => {
        setBrowsersState(installedBrowsers)
      },
    )

    /**
     * Receive URL
     * main -> renderer
     */
    electron.ipcRenderer.on(URL_UPDATED, (_: unknown, url: string) => {
      setUrl(url)
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
      setIsDefaultBrowser(bool)
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
  }, [
    setBrowsersState,
    setUrl,
    setVersion,
    setUpdateAvailable,
    setIsDefaultBrowser,
    dispatch,
  ])

  return <Noop />
}

export default TheMainListeners
