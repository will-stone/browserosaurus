import clsx from 'clsx'
import { css } from 'emotion'
import React from 'react'

import { useTheme } from '../store/selector-hooks'
import { themes } from '../themes'
import { useKeyboardEvents } from './hooks/use-keyboard-events'
import Settings from './organisms/settings'
import Tiles from './organisms/tiles'
import UrlBar from './organisms/url-bar'

const App: React.FC = () => {
  useKeyboardEvents()
  const theme = useTheme()

  return (
    <div
      className={clsx(
        'h-screen w-screen select-none flex flex-col items-center relative',
        css({ backgroundColor: themes[theme].bg }),
      )}
    >
      <UrlBar />
      <Tiles />
      <Settings />
    </div>
  )
}

export default App
