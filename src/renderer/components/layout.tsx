import clsx from 'clsx'
import { css } from 'emotion'
import React from 'react'

import { useSelector } from '../store'
import { useKeyboardEvents } from './hooks/use-keyboard-events'
import Tiles from './organisms/tiles'
import UrlBar from './organisms/url-bar'

const App: React.FC = () => {
  useKeyboardEvents()
  const theme = useSelector((state) => state.theme)

  return (
    <div
      className={clsx(
        'h-screen w-screen select-none flex flex-col items-center relative',
        css({
          // backgroundColor: theme.windowBackground,
          color: theme.text,
        }),
      )}
    >
      <Tiles />
      <UrlBar />
    </div>
  )
}

export default App
