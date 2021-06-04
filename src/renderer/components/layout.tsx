import clsx from 'clsx'
import React from 'react'

import { useSelector } from '../store'
import { useKeyboardEvents } from './hooks/use-keyboard-events'
import SupportMessage from './organisms/support-message'
import Tiles from './organisms/tiles'
import UrlBar from './organisms/url-bar'

const App: React.FC = () => {
  useKeyboardEvents()
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

  return (
    <div
      className={clsx(
        'h-screen w-screen select-none flex flex-col items-center relative',
        isDarkMode && 'text-white',
      )}
    >
      <Tiles />
      <UrlBar />
      <SupportMessage />
    </div>
  )
}

export default App
