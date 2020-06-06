import electron from 'electron'
import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'

import { Browser } from '../../config/browsers'
import {
  APP_VERSION,
  BROWSERS_SCANNED,
  FAVOURITE_CHANGED,
  HOTKEYS_RETRIEVED,
  PROTOCOL_STATUS,
  UPDATE_STATUS,
  URL_UPDATED,
} from '../../main/events'
import { Hotkeys } from '../../main/store'
import { RENDERER_LOADED } from '../events'
import {
  browsersAtom,
  favBrowserIdAtom,
  hotkeysAtom,
  isDefaultBrowserAtom,
  updateAvailableAtom,
  urlSelector,
  versionAtom,
} from '../state'
import Noop from './noop'

const TheMainListeners: React.FC = () => {
  const setUrl = useSetRecoilState(urlSelector)
  const setBrowsersState = useSetRecoilState(browsersAtom)
  const setVersion = useSetRecoilState(versionAtom)
  const setFavBrowserId = useSetRecoilState(favBrowserIdAtom)
  const setUpdateAvailable = useSetRecoilState(updateAvailableAtom)
  const setIsDefaultBrowser = useSetRecoilState(isDefaultBrowserAtom)
  const setHotkeys = useSetRecoilState(hotkeysAtom)

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
    electron.ipcRenderer.on(UPDATE_STATUS, (_: unknown, bool: boolean) => {
      setUpdateAvailable(bool)
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
     * Tell main that App component has mounted
     * renderer -> main
     */
    electron.ipcRenderer.send(RENDERER_LOADED)

    return function cleanup() {
      electron.ipcRenderer.removeAllListeners(APP_VERSION)
      electron.ipcRenderer.removeAllListeners(BROWSERS_SCANNED)
      electron.ipcRenderer.removeAllListeners(URL_UPDATED)
    }
  }, [
    setBrowsersState,
    setUrl,
    setVersion,
    setFavBrowserId,
    setUpdateAvailable,
    setIsDefaultBrowser,
    setHotkeys,
  ])

  return <Noop />
}

export default TheMainListeners
