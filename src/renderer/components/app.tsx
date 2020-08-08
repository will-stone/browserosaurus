import React, { useEffect } from 'react'
import { Provider } from 'react-redux'

import { mainLog } from '../sendToMain'
import store from '../store'
// import StatusBar from './app__status-bar'
import Tiles from './app__tiles'
import UrlBar from './app__url-bar'
import KeyboardManager from './manager__keyboard'
import MainEventsManager from './manager__main-events'
import MenusManager from './manager__menus'

const App: React.FC = () => {
  useEffect(() => {
    mainLog('App loaded')
  }, [])

  return (
    <Provider store={store}>
      <div className="h-screen w-screen select-none overflow-hidden text-grey-300 flex flex-col relative p-4">
        <UrlBar />

        <Tiles />

        {/* <StatusBar className="flex-shrink-0" /> */}

        <MenusManager />
        <KeyboardManager />
        <MainEventsManager />
      </div>
    </Provider>
  )
}

export default App
