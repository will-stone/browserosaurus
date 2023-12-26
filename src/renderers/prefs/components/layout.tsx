import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { startedPrefs } from '../state/actions.js'
import { HeaderBar } from './organisms/header-bar.js'
import { AboutPane } from './organisms/pane-about.js'
import { AppsPane } from './organisms/pane-apps.js'
import { GeneralPane } from './organisms/pane-general.js'

const useAppStarted = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(startedPrefs())
  }, [dispatch])
}

const Layout = (): JSX.Element => {
  /**
   * Tell main that renderer is available
   */
  useAppStarted()

  return (
    <div className="flex h-screen w-screen flex-col text-gray-800 dark:text-gray-300">
      <HeaderBar className="shrink-0" />
      <div className="flex grow flex-col overflow-hidden p-8">
        <GeneralPane />
        <AppsPane />
        <AboutPane />
      </div>
    </div>
  )
}

export default Layout
