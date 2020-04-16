import cc from 'classcat'
import electron from 'electron'
import * as React from 'react'
import { shallowEqual, useDispatch } from 'react-redux'

import { Browser } from '../config/browsers'
import { BROWSERS_SET, URL_RECEIVED } from '../config/events'
import styles from './App.module.css'
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

    // Setup main->renderer listeners
    electron.ipcRenderer.on(
      BROWSERS_SET,
      (_: unknown, installedBrowsers: Browser[]) => {
        dispatch(browsersReceived(installedBrowsers))
      },
    )

    // Detect key presses
    document.addEventListener('keydown', (event) => {
      dispatch(keyPress(event))
    })

    // Receive URL
    electron.ipcRenderer.on(URL_RECEIVED, (_: unknown, url: string) => {
      dispatch(urlReceived(url))
    })
  }, [dispatch])

  return (
    <>
      <div className={styles.titlebar}>Browserosaurus</div>
      <div className={styles.wrapper}>
        <div className={styles.aside}>
          <div className={styles.browsers}>
            {browsers.map((browser, i) => (
              <BrowserButton
                key={browser.id}
                browser={browser}
                className={cc({ [styles.browserIsFav]: i === 0 })}
              />
            ))}
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.content}>
            <div className={styles.currentUrl}>{currentUrl}</div>
            <div className={styles.panel} />
          </div>
          <div className={styles.activityBar} />
        </div>
      </div>
    </>
  )
}

export default App
