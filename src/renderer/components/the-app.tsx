import electron from 'electron'
import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'

import { Browser } from '../../config/browsers'
import { BROWSERS_SCANNED, URL_HISTORY_CHANGED } from '../../main/events'
import { UrlHistoryItem } from '../../main/store'
import { browsersState, urlHistoryState } from '../atoms'
import { APP_LOADED } from '../events'
import TheBrowserButtons from './the-browser-buttons'
import TheUrlBar from './the-url-bar'
import TheUrlHistory from './the-url-history'

const App: React.FC = () => {
  const setUrlHistoryState = useSetRecoilState(urlHistoryState)
  const setBrowsersState = useSetRecoilState(browsersState)

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
      (_: unknown, urlHistory: UrlHistoryItem[]) => {
        setUrlHistoryState(urlHistory)
      },
    )

    /**
     * Detect key presses
     * document listener
     */
    // document.addEventListener('keydown', (event) => {
    //   // Launch browser if alpha key is a hotkey
    //   const keyMatch = event.code.match(/^Key([A-Z])$/u)

    //   if (keyMatch) {
    //     const value = keyMatch[1].toLowerCase()
    //     const { browsers } = store.getState()
    //     const browser = browsers.find((b) => b.hotKey === value)
    //     if (browser) {
    //       runBrowser(browser.id, event.altKey)
    //     }
    //   }
    // })

    /**
     * Tell main that App component has mounted
     * renderer -> main
     */
    electron.ipcRenderer.send(APP_LOADED)
  }, [setBrowsersState, setUrlHistoryState])

  return (
    <div className="h-screen w-screen select-none overflow-hidden text-grey-300 flex flex-col">
      <div className="flex-shrink-0 bg-grey-700 h-6 flex items-center justify-center text-grey-300 border-b border-grey-900 tracking-wider draggable text-xs">
        Browserosaurus
      </div>

      <TheUrlBar />

      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar */}
        <div
          className="flex-shrink-0 bg-grey-800 border-r border-grey-900 flex flex-col justify-between"
          style={{ width: '280px' }}
        >
          <div className="p-4 overflow-y-auto">
            <TheBrowserButtons />
          </div>
          <div className="p-4 flex-shrink-0">Copy to clipboard</div>
        </div>
        {/* Main */}
        <div className="flex-grow flex flex-col overflow-hidden">
          <div className="p-4 overflow-y-auto">
            <h1 className="text-5xl mb-8 leading-none font-semibold text-blue-400 font-rounded">
              History
            </h1>
            <TheUrlHistory />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
