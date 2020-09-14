import React from 'react'

import Settings from './app__settings'
import Tiles from './app__tiles'
import UrlBar from './app__url-bar'
import KeyboardManager from './manager__keyboard'
import MainEventsManager from './manager__main-events'
import MouseDiv from './organisms/mouse-div'

const App: React.FC = () => {
  return (
    <>
      <MouseDiv className="h-screen w-screen select-none flex flex-col items-center relative">
        <UrlBar className="mb-8" />
        <Tiles />
        <Settings />
      </MouseDiv>

      <KeyboardManager />
      <MainEventsManager />
    </>
  )
}

export default App
