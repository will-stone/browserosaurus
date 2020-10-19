import React from 'react'

import { useKeyboardEvents } from './hooks/use-keyboard-events'
import MouseDiv from './molecules/mouse-div'
import Settings from './organisms/settings'
import Tiles from './organisms/tiles'
import UrlBar from './organisms/url-bar'

const App: React.FC = () => {
  useKeyboardEvents()

  return (
    <MouseDiv className="h-screen w-screen select-none flex flex-col items-center relative">
      <UrlBar className="mb-8" />
      <Tiles />
      <Settings />
    </MouseDiv>
  )
}

export default App
