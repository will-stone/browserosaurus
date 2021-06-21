import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { prefsStarted } from '../../../shared/state/actions'
import { useSelector } from '../../../shared/state/hooks'
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

  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

  return (
    <div className={clsx('max-h-screen', isDarkMode && 'dark')}>
      <div className="flex flex-col max-h-screen text-gray-700 dark:text-gray-300">
        <HeaderBar className="flex-shrink-0" />
        <hr className="border-white dark:border-black" />
        <div className="flex-grow overflow-hidden p-8 flex flex-col">
          <GeneralPane />
          <AppsPane />
        </div>
      </div>
    </div>
  )
}

export default Layout
