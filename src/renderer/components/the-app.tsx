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
      <div className="flex-shrink-0 bg-grey-700 pb-4">
        <div className="draggable pb-4">
          <div className="h-10 flex items-center justify-center tracking-wider text-xs font-medium">
            Browserosaurus
          </div>
        </div>

        <TheUrlBar className="mx-4 mb-4" />

        <div className="flex-shrink-0 flex flex-col justify-between">
          <div className="px-4">
            <TheBrowserButtons />
          </div>
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
