import cc from 'classcat'
import electron from 'electron'
import React, { useCallback, useEffect } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'

import { Browser } from '../../config/browsers'
import {
  APP_VERSION,
  BROWSERS_SCANNED,
  FAVOURITE_CHANGED,
  UPDATE_STATUS,
  URL_HISTORY_CHANGED,
} from '../../main/events'
import { UrlHistoryItem } from '../../main/store'
import {
  browsersAtom,
  favBrowserIdAtom,
  openMenuAtom,
  updateAvailableAtom,
  urlHistoryAtom,
  versionAtom,
} from '../atoms'
import { RENDERER_LOADED } from '../events'
import { urlIdSelector } from '../selectors'
import { mainLog, quit } from '../sendToMain'
import Icon from './icon'
import TheBrowserButtons from './the-browser-buttons'
import TheKeyboardListeners from './the-keyboard-listeners'
import TheMenuManager from './the-menu-manager'
import TheUrlBar from './the-url-bar'
import Version from './version'

const App: React.FC = () => {
  const setUrlHistoryState = useSetRecoilState(urlHistoryAtom)
  const setBrowsersState = useSetRecoilState(browsersAtom)
  const setUrlId = useSetRecoilState(urlIdSelector)
  const setVersion = useSetRecoilState(versionAtom)
  const setFavBrowserId = useSetRecoilState(favBrowserIdAtom)
  const setUpdateAvailable = useSetRecoilState(updateAvailableAtom)

  const [openMenu, setOpenMenu] = useRecoilState(openMenuAtom)

  const handleMenuClick = useCallback(() => {
    setOpenMenu(openMenu === 'fav' ? false : 'fav')
  }, [openMenu, setOpenMenu])

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

  return (
    <div className="h-screen w-screen select-none overflow-hidden text-grey-300 flex flex-col relative">
      <div className="flex-shrink-0 flex-grow p-4 border-b border-grey-900 relative">
        <TheUrlBar className="mb-4" />

        <div className="flex-shrink-0 flex flex-col justify-between">
          <TheBrowserButtons />
        </div>
      </div>

      <div className="flex-shrink-0 h-16 px-4 bg-grey-700 flex items-center justify-between overflow-hidden text-xs font-bold space-x-4">
        <button
          className={cc([
            'bg-grey-600',
            'border border-grey-900 rounded shadow-md active:shadow-none focus:outline-none',
            'text-xs active:text-grey-200 font-bold',
            'py-1 px-2',
            'cursor-default',
            { 'z-30': openMenu === 'fav' },
          ])}
          onClick={handleMenuClick}
          type="button"
        >
          {openMenu === 'fav' ? <Icon icon="cross" /> : <Icon icon="star" />}
        </button>

        <Version className="text-grey-500" />

        <button
          className={cc([
            'bg-grey-600',
            'border border-grey-900 rounded shadow-md active:shadow-none focus:outline-none',
            'text-xs active:text-grey-200 font-bold',
            'py-1 px-2',
            'cursor-default',
          ])}
          onClick={quit}
          type="button"
        >
          <Icon icon="exit" />
        </button>
      </div>

      <TheMenuManager />
      <TheKeyboardListeners />
    </div>
  )
}

export default App
