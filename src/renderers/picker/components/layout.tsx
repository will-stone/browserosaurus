import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Spinner } from '../../shared/components/atoms/spinner'
import {
  useDeepEqualSelector,
  useInstalledApps,
  useKeyCodeMap,
  useSelector,
} from '../../shared/state/hooks'
import { firstAppRef } from '../refs'
import { startedPicker } from '../state/actions'
import AppLogo from './atoms/app-logo'
import Kbd from './atoms/kbd'
import { useKeyboardEvents } from './hooks/use-keyboard-events'
import { AppButton } from './molecules/app-button'
import SupportMessage from './organisms/support-message'
import UpdateBar from './organisms/update-bar'
import UrlBar from './organisms/url-bar'

const useAppStarted = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(startedPicker())
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

  const apps = useInstalledApps()
  const url = useSelector((state) => state.data.url)
  const icons = useDeepEqualSelector((state) => state.data.icons)

  const keyCodeMap = useKeyCodeMap()

  return (
    <div
      className="relative flex h-screen w-screen select-none flex-col items-center bg-white dark:bg-gray-800 dark:text-white"
      title={url}
    >
      {!apps[0] && (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      )}

      <div className="relative w-full grow divide-y divide-black/10 overflow-y-auto dark:divide-white/10">
        {apps.map((app, index) => {
          const key = app.id + index
          return (
            <div key={key}>
              <AppButton
                ref={index === 0 ? firstAppRef : null}
                app={app}
                className="flex h-12 w-full shrink-0 items-center justify-between space-x-4 px-4 py-2 text-left"
              >
                <span>{app.name}</span>
                <span className="flex items-center space-x-4">
                  {app.hotCode && (
                    <Kbd className="shrink-0">{keyCodeMap[app.hotCode]}</Kbd>
                  )}
                  <AppLogo
                    app={app}
                    className="h-8 w-8 shrink-0"
                    icon={icons[app.id]}
                  />
                </span>
              </AppButton>
            </div>
          )
        })}
      </div>

      <UrlBar />

      <UpdateBar />

      <SupportMessage />
    </div>
  )
}

export default App
