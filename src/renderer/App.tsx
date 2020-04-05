import './App.css'

import cc from 'classcat'
import { ipcRenderer } from 'electron'
import * as React from 'react'
import SplitPane from 'react-split-pane'

import browserLogos from '../config/browserLogos'
import { BROWSERS_GET, FAV_GET } from '../config/events'
import useBrowsers from './hooks/useBrowsers'
import useOpt from './hooks/useOpt'

const { useEffect } = React

const App: React.FC = () => {
  const browserNames = useBrowsers()
  useOpt()

  // Get browsers on load
  useEffect(() => {
    ipcRenderer.send(BROWSERS_GET)
    ipcRenderer.send(FAV_GET)
  }, [])

  return (
    <SplitPane className="app" defaultSize={300} minSize={300} split="vertical">
      <div>
        <div className="titlebar">Browserosaurus</div>
        <div className="browsers">
          {browserNames.map((browserName, i) => (
            <div
              key={browserName}
              className={cc(['browser', { 'browser--fav': i === 0 }])}
            >
              <img
                alt={browserName}
                className="browser__logo"
                src={browserLogos[browserName]}
              />
              <div
                className={cc([
                  'browser__title',
                  { 'browser__title--long': browserName.length > 10 },
                ])}
              >
                {browserName}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="main">
        <div className="titlebar" />
      </div>
    </SplitPane>
  )
}

export default App
