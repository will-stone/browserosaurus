import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { prefsStarted } from '../../../shared/state/actions'
import { HeaderBar } from './organisms/header-bar'
import { AboutPane } from './organisms/pane-about'
import { GeneralPane } from './organisms/pane-general'
import { AppsPane } from './organisms/pane-tiles'

const useAppStarted = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(prefsStarted())
  }, [dispatch])
}

const Layout = (): JSX.Element => {
  /**
   * Tell main that renderer is available
   */
  useAppStarted()

  return (
    <div className="flex flex-col h-screen w-screen text-gray-800 dark:text-gray-300">
      <HeaderBar className="flex-shrink-0" />
      <div className="flex-grow overflow-hidden p-8 flex flex-col">
        <GeneralPane />
        <AppsPane />
        <AboutPane />
      </div>
    </div>
  )
}

export default Layout
