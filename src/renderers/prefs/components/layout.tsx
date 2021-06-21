import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { prefsStarted } from '../../../shared/state/actions'
import { HeaderBar } from './organisms/header-bar'
import { AppsPane } from './organisms/pane-apps'
import { GeneralPane } from './organisms/pane-general'

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
      <HeaderBar className="flex-shrink-0 mb-6" />
      <hr className="border-gray-200 dark:border-gray-900" />
      <div className="flex-grow overflow-hidden p-8 flex flex-col">
        <GeneralPane />
        <AppsPane />
      </div>
    </div>
  )
}

export default Layout
