import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { pickerStarted } from '../../../shared/state/actions'
import { useInstalledApps } from '../../../shared/state/hooks'
import { favAppRef } from '../refs'
import AppLogo from './atoms/app-logo'
import Kbd from './atoms/kbd'
import { useKeyboardEvents } from './hooks/use-keyboard-events'
import { AppButton } from './molecules/app-button'
import SupportMessage from './organisms/support-message'
import UrlBar from './organisms/url-bar'

const useAppStarted = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(pickerStarted())
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

  const [favApp, ...normalApps] = useInstalledApps()

  return (
    <div className="h-screen w-screen select-none flex flex-col items-center relative dark:text-white">
      <div className="flex-grow w-full flex relative overflow-hidden px-4 pt-2 space-x-4">
        <div className="flex-shrink-0 pt-2 pb-4">
          {favApp && (
            <AppButton
              ref={favAppRef}
              app={favApp}
              className="flex flex-col items-center justify-start px-8 py-4"
            >
              <AppLogo app={favApp} className="h-20 w-20 mb-2" />
              <span>{favApp.name}</span>
              {favApp.hotkey && <Kbd className="mt-2">{favApp.hotkey}</Kbd>}
            </AppButton>
          )}
        </div>

        <div className="relative flex-grow w-full overflow-y-scroll space-y-2 py-2 pr-4 pl-1">
          {normalApps.map((app, index) => {
            const key = app.id + index
            return (
              <AppButton
                key={key}
                app={app}
                className="flex-shrink-0 flex items-center text-left px-4 py-3 space-x-4 w-full"
              >
                <AppLogo app={app} className="flex-shrink-0 h-8 w-8" />
                {app.hotkey && (
                  <Kbd className="flex-shrink-0">{app.hotkey}</Kbd>
                )}
                <span>{app.name}</span>
              </AppButton>
            )
          })}
        </div>
      </div>
      <UrlBar />
      <SupportMessage />
    </div>
  )
}

export default App
