import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { tilesStarted } from '../../../shared/state/actions'
import { useKeyboardEvents } from './hooks/use-keyboard-events'
import SupportMessage from './organisms/support-message'
import Tiles from './organisms/tiles'
import UrlBar from './organisms/url-bar'

const useAppStarted = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(tilesStarted())
  }, [dispatch])
}

const App: React.FC = () => {
  /**
   * Tell main that renderer is available
   */
  useAppStarted()

  /**
   * Setup keyboard listeners
   */
  useKeyboardEvents()

  return (
    <div className="h-screen w-screen select-none flex flex-col items-center relative dark:text-white">
      <Tiles />
      <UrlBar />
      <SupportMessage />
    </div>
  )
}

export default App
