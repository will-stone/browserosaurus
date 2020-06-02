import electron from 'electron'
import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'

import { Browser } from '../../config/browsers'
import {
  APP_VERSION,
  BROWSERS_SCANNED,
  FAVOURITE_CHANGED,
  PROTOCOL_STATUS,
  UPDATE_STATUS,
  URL_HISTORY_CHANGED,
} from '../../main/events'
import { UrlHistoryItem } from '../../main/store'
import {
  browsersAtom,
  favBrowserIdAtom,
  protocolStatusAtom,
  updateAvailableAtom,
  urlHistoryAtom,
  versionAtom,
} from '../atoms'
import { RENDERER_LOADED } from '../events'
import { urlIdSelector } from '../selectors'
import Noop from './noop'

const TheMainListeners: React.FC = () => {
  const setUrlHistoryState = useSetRecoilState(urlHistoryAtom)
  const setBrowsersState = useSetRecoilState(browsersAtom)
  const setUrlId = useSetRecoilState(urlIdSelector)
  const setVersion = useSetRecoilState(versionAtom)
  const setFavBrowserId = useSetRecoilState(favBrowserIdAtom)
  const setUpdateAvailable = useSetRecoilState(updateAvailableAtom)
  const setProtocolStatusAtom = useSetRecoilState(protocolStatusAtom)

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
    electron.ipcRenderer.on(
      URL_HISTORY_CHANGED,
      (_: unknown, urlHistory: UrlHistoryItem[]) => {
        // TODO should this use the latest history item?
        const undef = undefined
        setUrlId(undef)
        setUrlHistoryState(urlHistory)
      },
    )

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
      setProtocolStatusAtom(bool)
    })

    /**
     * Tell main that App component has mounted
     * renderer -> main
     */
    electron.ipcRenderer.send(RENDERER_LOADED)

    return function cleanup() {
      electron.ipcRenderer.removeAllListeners(APP_VERSION)
      electron.ipcRenderer.removeAllListeners(BROWSERS_SCANNED)
      electron.ipcRenderer.removeAllListeners(URL_HISTORY_CHANGED)
    }
  }, [
    setBrowsersState,
    setUrlId,
    setUrlHistoryState,
    setVersion,
    setFavBrowserId,
    setUpdateAvailable,
  ])

  return <Noop />
}

export default TheMainListeners
