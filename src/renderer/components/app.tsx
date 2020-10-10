import React from 'react'

import { useKeyboardEvents } from './hooks/use-keyboard-events'
import { useMainEvents } from './hooks/use-main-events'
import MouseDiv from './molecules/mouse-div'
import Settings from './settings'
import Tiles from './tiles'
import UrlBar from './url-bar'

const App: React.FC = () => {
  useKeyboardEvents()
  useMainEvents()

  return (
    <MouseDiv className="h-screen w-screen select-none flex flex-col items-center relative">
      <UrlBar className="mb-8" />
      <Tiles />
      <Settings />
    </MouseDiv>
  )
}

export default App
