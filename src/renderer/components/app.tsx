import React, { useEffect } from 'react'
import { Provider } from 'react-redux'

import { mainLog } from '../sendToMain'
import store from '../store'
import Settings from './app__settings'
import Tiles from './app__tiles'
import UrlBar from './app__url-bar'
import KeyboardManager from './manager__keyboard'
import MainEventsManager from './manager__main-events'
import MouseDiv from './organisms/mouse-div'

const App: React.FC = () => {
  useEffect(() => {
    mainLog('App loaded')
  }, [])

  return (
    <Provider store={store}>
      <MouseDiv className="h-screen w-screen select-none text-grey-300 flex flex-col items-center relative">
        <UrlBar className="mb-8" />
        <Tiles />
        <Settings />
      </MouseDiv>

      <KeyboardManager />
      <MainEventsManager />
    </Provider>
  )
}

export default App
