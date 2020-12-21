import clsx from 'clsx'
import React from 'react'

import { useKeyboardEvents } from './hooks/use-keyboard-events'
import Settings from './organisms/settings'
import Tiles from './organisms/tiles'
import UrlBar from './organisms/url-bar'

const App: React.FC = () => {
  useKeyboardEvents()
  // const theme = useTheme()

  return (
    <div
      className={clsx(
        'h-screen w-screen select-none flex flex-col items-center relative',
      )}
    >
      <UrlBar />
      <Tiles />
      <Settings />
    </div>
  )
}

export default App
