import cc from 'classcat'
import { ipcRenderer } from 'electron'
import * as React from 'react'
import SplitPane from 'react-split-pane'

import { BROWSERS_GET } from '../config/events'
import styles from './App.module.css'
import BrowserButton from './components/BrowserButton'
import useBrowsers from './hooks/useBrowsers'
import useOpt from './hooks/useOpt'

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
  const browsers = useBrowsers()
  useOpt()

  // Get browsers on load
  useEffect(() => {
    ipcRenderer.send(BROWSERS_GET)
  }, [])

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
