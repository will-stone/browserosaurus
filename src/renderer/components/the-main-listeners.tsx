import electron from 'electron'
import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'

import { Browser } from '../../config/browsers'
import {
  APP_VERSION,
  BROWSERS_SCANNED,
  FAVOURITE_CHANGED,
  HIDDEN_TILE_IDS_RETRIEVED,
  HOTKEYS_RETRIEVED,
  PROTOCOL_STATUS,
  UPDATE_DOWNLOADED,
  URL_UPDATED,
} from '../../main/events'
import { Hotkeys } from '../../main/store'
import { RENDERER_LOADED } from '../events'
import {
  browsersAtom,
  favBrowserIdAtom,
  hiddenTileIdsAtom,
  hotkeysAtom,
  isDefaultBrowserAtom,
  isUpdateAvailableAtom,
  urlSelector,
  versionAtom,
} from '../state'
import Noop from './noop'

const TheMainListeners: React.FC = () => {
  const setUrl = useSetRecoilState(urlSelector)
  const setBrowsersState = useSetRecoilState(browsersAtom)
  const setVersion = useSetRecoilState(versionAtom)
  const setFavBrowserId = useSetRecoilState(favBrowserIdAtom)
  const setUpdateAvailable = useSetRecoilState(isUpdateAvailableAtom)
  const setIsDefaultBrowser = useSetRecoilState(isDefaultBrowserAtom)
  const setHotkeys = useSetRecoilState(hotkeysAtom)
  const setHiddenTileIds = useSetRecoilState(hiddenTileIdsAtom)

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
     * Receive favourite
     * main -> renderer
     */
    electron.ipcRenderer.on(
      FAVOURITE_CHANGED,
      (_: unknown, favBrowserId: string) => {
        setFavBrowserId(favBrowserId)
      },
    )

    /**
     * Receive protocol status
     * main -> renderer
     */
    electron.ipcRenderer.on(PROTOCOL_STATUS, (_: unknown, bool: boolean) => {
      setIsDefaultBrowser(bool)
    })

    /**
     * Receive hotkeys
     * main -> renderer
     */
    electron.ipcRenderer.on(
      HOTKEYS_RETRIEVED,
      (_: unknown, hotkeys: Hotkeys) => {
        setHotkeys(hotkeys)
      },
    )

    /**
     * Receive hidden tile IDs
     * main -> renderer
     */
    electron.ipcRenderer.on(
      HIDDEN_TILE_IDS_RETRIEVED,
      (_: unknown, tileIds: string[]) => {
        setHiddenTileIds(tileIds)
      },
    )

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
      electron.ipcRenderer.removeAllListeners(FAVOURITE_CHANGED)
      electron.ipcRenderer.removeAllListeners(PROTOCOL_STATUS)
      electron.ipcRenderer.removeAllListeners(HOTKEYS_RETRIEVED)
      electron.ipcRenderer.removeAllListeners(HIDDEN_TILE_IDS_RETRIEVED)
    }
  }, [
    setBrowsersState,
    setUrl,
    setVersion,
    setFavBrowserId,
    setUpdateAvailable,
    setIsDefaultBrowser,
    setHotkeys,
    setHiddenTileIds,
  ])

  return <Noop />
}

export default TheMainListeners
