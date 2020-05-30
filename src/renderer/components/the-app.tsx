import cc from 'classcat'
import electron from 'electron'
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'

import { Browser } from '../../config/browsers'
import {
  APP_VERSION,
  BROWSERS_SCANNED,
  URL_HISTORY_CHANGED,
} from '../../main/events'
import { UrlHistoryItem } from '../../main/store'
import { browsersAtom, urlHistoryAtom } from '../atoms'
import { APP_LOADED } from '../events'
import { urlIdSelector } from '../selectors'
import TheBrowserButtons from './the-browser-buttons'
import TheKeyboardListeners from './the-keyboard-listeners'
import TheUrlBar from './the-url-bar'

const App: React.FC = () => {
  const setUrlHistoryState = useSetRecoilState(urlHistoryAtom)
  const setBrowsersState = useSetRecoilState(browsersAtom)
  const setUrlId = useSetRecoilState(urlIdSelector)

  const [version, setVersion] = useState<string>()

  useEffect(() => {
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
     * Tell main that App component has mounted
     * renderer -> main
     */
    electron.ipcRenderer.send(APP_LOADED)
  })

  return (
    <div className="h-screen w-screen select-none overflow-hidden text-grey-300 flex flex-col">
      <div className="flex-shrink-0 flex-grow p-4 border-b border-grey-900">
        <TheUrlBar className="mb-4" />

        <div className="flex-shrink-0 flex flex-col justify-between">
          <TheBrowserButtons />
        </div>
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
          type="button"
        >
          <svg
            aria-hidden="true"
            className="w-4"
            focusable="false"
            role="img"
            viewBox="0 0 448 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
              fill="currentColor"
            />
          </svg>
        </button>

        {version && <span className="text-grey-500">v{version}</span>}
      </div>

      <TheKeyboardListeners />
    </div>
  )
}

export default App
