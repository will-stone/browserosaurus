import cc from 'classcat'
import electron from 'electron'
import * as React from 'react'
import { shallowEqual, useDispatch } from 'react-redux'
import SplitPane from 'react-split-pane'

import { Browser } from '../config/browsers'
import { BROWSERS_SET } from '../config/events'
import styles from './App.module.css'
import BrowserButton from './components/BrowserButton'
import { useSelector } from './store'
import { appLoaded, browsersReceived, keyPress } from './store/actions'

const { useEffect } = React

const resizerStyle: React.CSSProperties = {
  zIndex: 1,
  boxSizing: 'border-box',
  backgroundClip: 'padding-box',
  width: '11px',
  margin: '0 -5px',
  borderLeft: '5px solid rgba(255, 255, 255, 0)',
  borderRight: '5px solid rgba(255, 255, 255, 0)',
  cursor: 'col-resize',
}

const App: React.FC = () => {
  const dispatch = useDispatch()
  const browsers = useSelector((state) => state.browsers, shallowEqual)

  useEffect(() => {
    dispatch(appLoaded())

    // Setup main->renderer listeners
    electron.ipcRenderer.on(
      BROWSERS_SET,
      (_: unknown, installedBrowsers: Browser[]) => {
        dispatch(browsersReceived(installedBrowsers))
      },
    )

    document.addEventListener('keydown', (event) => {
      dispatch(keyPress(event))
    })
  }, [dispatch])

  return (
    <SplitPane
      className={styles.app}
      defaultSize={300}
      minSize={300}
      resizerStyle={resizerStyle}
      split="vertical"
    >
      <div>
        <div className={styles.titlebar}>Browserosaurus</div>
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
        <div className={styles.titlebar} />
      </div>
    </SplitPane>
  )
}

export default App
