import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { startedPrefs } from '../state/actions'
import { HeaderBar } from './organisms/header-bar'
import { AboutPane } from './organisms/pane-about'
import { AppsPane } from './organisms/pane-apps'
import { GeneralPane } from './organisms/pane-general'

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
