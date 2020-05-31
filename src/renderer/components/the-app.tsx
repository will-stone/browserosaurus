import cc from 'classcat'
import electron from 'electron'
import React, { useCallback, useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'

import { Browser } from '../../config/browsers'
import {
  APP_VERSION,
  BROWSERS_SCANNED,
  FAVOURITE_CHANGED,
  URL_HISTORY_CHANGED,
} from '../../main/events'
import { UrlHistoryItem } from '../../main/store'
import {
  browsersAtom,
  favBrowserIdAtom,
  urlHistoryAtom,
  versionAtom,
} from '../atoms'
import { RENDERER_LOADED } from '../events'
import { urlIdSelector } from '../selectors'
import { mainLog } from '../sendToMain'
import Icon from './icon'
import TheBrowserButtons from './the-browser-buttons'
import TheKeyboardListeners from './the-keyboard-listeners'
import TheMenu from './the-menu'
import TheUrlBar from './the-url-bar'
import Version from './version'

const App: React.FC = () => {
  const setUrlHistoryState = useSetRecoilState(urlHistoryAtom)
  const setBrowsersState = useSetRecoilState(browsersAtom)
  const setUrlId = useSetRecoilState(urlIdSelector)
  const setVersion = useSetRecoilState(versionAtom)
  const setFavBrowserId = useSetRecoilState(favBrowserIdAtom)

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const handleMenuClick = useCallback(() => {
    setIsMenuOpen(!isMenuOpen)
  }, [isMenuOpen, setIsMenuOpen])

  useEffect(() => {
    mainLog('App loaded')

    /**
     * Receive version
     * main -> renderer
     */
    electron.ipcRenderer.on(APP_VERSION, (_: unknown, string: string) => {
      setVersion(string)
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
  ])

  return (
    <div className="h-screen w-screen select-none overflow-hidden text-grey-300 flex flex-col">
      <div className="flex-shrink-0 flex-grow p-4 border-b border-grey-900 relative">
        <TheUrlBar className="mb-4" />

        <div className="flex-shrink-0 flex flex-col justify-between">
          <TheBrowserButtons />
        </div>

        {isMenuOpen && <TheMenu />}
      </div>

      <div className="h-16 px-4 bg-grey-700 flex items-center justify-between overflow-hidden text-xs font-bold space-x-4">
        <button
          className={cc([
            'bg-grey-600',
            'border border-grey-900 rounded shadow-md active:shadow-none focus:outline-none',
            'text-xs active:text-grey-200 font-bold',
            'py-1 px-2',
            'cursor-default',
          ])}
          onClick={handleMenuClick}
          type="button"
        >
          {isMenuOpen ? <Icon icon="cross" /> : <Icon icon="menu" />}
        </button>

        <Version className="text-grey-500" />
      </div>

      <TheKeyboardListeners />
    </div>
  )
}

export default App
