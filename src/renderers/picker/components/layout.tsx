import clsx from 'clsx'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Spinner } from '../../shared/components/atoms/spinner'
import {
  useDeepEqualSelector,
  useInstalledApps,
  useKeyCodeMap,
  useSelector,
} from '../../shared/state/hooks'
import { appsRef, appsScrollerRef } from '../refs'
import { clickedApp, startedPicker } from '../state/actions'
import AppLogo from './atoms/app-logo'
import Kbd from './atoms/kbd'
import { useKeyboardEvents } from './hooks/use-keyboard-events'
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
  const dispatch = useDispatch()

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

  // const totalApps = apps.length

  // useEffect(() => {}, [totalApps])

  return (
    <div
      className="relative flex h-screen w-screen select-none flex-col items-center px-2 pt-4 dark:text-white"
      title={url}
    >
      {!apps[0] && (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      )}

      <div
        ref={appsScrollerRef}
        className="relative w-full grow overflow-y-auto px-2 pb-2"
      >
        {apps.map((app, index) => {
          return (
            <div key={app.name}>
              <button
                ref={(element) => {
                  if (!appsRef.current) {
                    appsRef.current = []
                  }

                  if (element) {
                    appsRef.current[index] = element
                  }
                }}
                aria-label={`${app.name} App`}
                className={clsx(
                  'flex h-12 w-full shrink-0 items-center justify-between space-x-4 px-4 py-2 text-left',
                  'focus:bg-blue-500 focus:text-white focus:outline-none focus:dark:bg-blue-700',
                  'hover:bg-black/10 hover:dark:bg-blue-50/10',
                  'rounded-xl',
                )}
                onClick={(event) =>
                  dispatch(
                    clickedApp({
                      appName: app.name,
                      isAlt: event.altKey,
                      isShift: event.shiftKey,
                    }),
                  )
                }
                onKeyDown={(event) => {
                  if (event.code === 'ArrowDown') {
                    event.preventDefault()
                    event.stopPropagation()
                    appsRef.current?.[index + 1].focus()
                  } else if (event.code === 'ArrowUp') {
                    event.preventDefault()
                    event.stopPropagation()
                    appsRef.current?.[index - 1].focus()
                  }
                }}
                type="button"
              >
                <span>{app.name}</span>
                <span className="flex items-center space-x-4">
                  {app.hotCode ? (
                    <Kbd className="shrink-0">{keyCodeMap[app.hotCode]}</Kbd>
                  ) : null}
                  <AppLogo
                    app={app}
                    className="h-6 w-6 shrink-0"
                    icon={icons[app.name]}
                  />
                </span>
              </button>
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
