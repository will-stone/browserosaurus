import React from 'react'
import { Provider } from 'react-redux'

import store from '../store'
import Noop from './atoms/noop'
import { useKeyboardEvents } from './hooks/use-keyboard-events'
import { useMainEvents } from './hooks/use-main-events'
import MouseDiv from './molecules/mouse-div'
import Settings from './settings'
import Tiles from './tiles'
import UrlBar from './url-bar'

const Hooks = () => {
  useKeyboardEvents()
  useMainEvents()
  return <Noop />
}

const Layout: React.FC = () => {
  return (
    <Provider store={store}>
      <Hooks />

      <MouseDiv className="h-screen w-screen select-none flex flex-col items-center relative">
        <UrlBar className="mb-8" />
        <Tiles />
        <Settings />
      </MouseDiv>
    </Provider>
  )
}

export default Layout
