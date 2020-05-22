import cc from 'classcat'
import electron from 'electron'
import * as React from 'react'
import { shallowEqual, useDispatch } from 'react-redux'

import { Browser } from '../config/browsers'
import { BROWSERS_SET, URL_RECEIVED } from '../config/events'
import BrowserButton from './components/BrowserButton'
import { useSelector } from './store'
import {
  appLoaded,
  browsersReceived,
  keyPress,
  urlReceived,
} from './store/actions'

const { useEffect } = React

const App: React.FC = () => {
  const dispatch = useDispatch()
  const browsers = useSelector((state) => state.browsers, shallowEqual)
  const currentUrl = useSelector((state) => state.app.currentUrl)

  useEffect(() => {
    dispatch(appLoaded())

    /**
     * Setup main->renderer listeners
     */

    // Receive browsers
    electron.ipcRenderer.on(
      BROWSERS_SET,
      (_: unknown, installedBrowsers: Browser[]) => {
        dispatch(browsersReceived(installedBrowsers))
      },
    )

    // Receive URL
    electron.ipcRenderer.on(URL_RECEIVED, (_: unknown, url: string) => {
      dispatch(urlReceived(url))
    })

    // Detect key presses
    document.addEventListener('keydown', (event) => {
      dispatch(keyPress(event))
    })
  }, [dispatch])

  return (
    <div className="h-screen w-screen flex select-none overflow-hidden text-grey-200">
      {/* Sidebar */}
      <div className="flex-shrink-0 bg-grey-800" style={{ width: '280px' }}>
        <div className="draggable h-10 flex items-center pl-24 mb-4 font-bold text-sm tracking-wider">
          Browserosaurus
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          {browsers.map((browser, i) => (
            <BrowserButton
              key={browser.id}
              browser={browser}
              className={cc({ 'col-span-2': i === 0 })}
            />
          ))}
        </div>
      </div>
      {/* Main */}
      <div className="flex-1 p-4">
        <div>{currentUrl}</div>
        <div>Lorem ipsum dolor sit amet.</div>
      </div>
    </div>
  )
}

export default App
