import cc from 'classcat'
import electron from 'electron'
import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'

import { Browser } from '../../config/browsers'
import { BROWSERS_SCANNED, URL_HISTORY_CHANGED } from '../../main/events'
import { UrlHistoryStore } from '../../main/stores'
import { browsersAtom, urlHistoryAtom } from '../atoms'
import { APP_LOADED, KEY_PRESSED } from '../events'
import { urlIdSelector } from '../selectors'
import TheBrowserButtons from './the-browser-buttons'
import TheUrlBar from './the-url-bar'
import TheUrlHistory from './the-url-history'

const App: React.FC = () => {
  const setUrlHistoryState = useSetRecoilState(urlHistoryAtom)
  const setBrowsersState = useSetRecoilState(browsersAtom)
  const setUrlId = useSetRecoilState(urlIdSelector)

  useEffect(() => {
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
      (_: unknown, urlHistory: UrlHistoryStore) => {
        setUrlId()
        setUrlHistoryState(urlHistory)
      },
    )

    /**
     * Detect key presses
     * document listener
     */
    document.addEventListener('keydown', (event) => {
      // TODO need a way to turn on and off keyboard entry when the
      // functionality requires it.
      const matchAlpha = event.code.match(/^Key([A-Z])$/u)

      let key

      if (matchAlpha) {
        key = matchAlpha[1].toLowerCase()
      } else if (event.code === 'Space' || event.code === 'Enter') {
        key = event.code.toLowerCase()
      }

      if (key) {
        // event.preventDefault()
        electron.ipcRenderer.send(KEY_PRESSED, { key, isAlt: event.altKey })
      }
    })

    /**
     * Tell main that App component has mounted
     * renderer -> main
     */
    electron.ipcRenderer.send(APP_LOADED)
  })

  return (
    <div className="h-screen w-screen select-none overflow-hidden text-grey-300 flex flex-col">
      <div className="flex-shrink-0 bg-grey-700 p-4">
        <div className="pb-4 flex items-center space-x-4">
          <button
            className={cc([
              'bg-grey-800 active:bg-grey-900',
              'border border-grey-900 rounded shadow focus:outline-none',
              'text-xs active:text-grey-200 font-bold',
              'py-1 px-2 space-x-2',
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

          <TheUrlBar className="flex-grow" />

          <button
            className={cc([
              'bg-grey-800 active:bg-grey-900',
              'border border-grey-900 rounded shadow focus:outline-none',
              'text-xs active:text-grey-200 font-bold',
              'py-1 px-2 space-x-2',
              'cursor-default',
            ])}
            type="button"
          >
            <span>Copy</span>
            <kbd className="opacity-50 tracking-widest">⌘+C</kbd>
          </button>
        </div>

        <div className="flex-shrink-0 flex flex-col justify-between">
          <TheBrowserButtons />
        </div>
      </div>

      <div className="flex-grow flex flex-col overflow-hidden">
        <h1 className="p-4 text-xl leading-none font-semibold font-rounded">
          History
        </h1>
        <div className="px-4 pb-4 overflow-y-auto">
          <TheUrlHistory />
        </div>
      </div>
    </div>
  )
}

export default App
