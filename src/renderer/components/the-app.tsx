import React, { useEffect } from 'react'
import { RecoilRoot } from 'recoil'

import { mainLog } from '../sendToMain'
import TheBrowserButtons from './the-browser-buttons'
import TheKeyboardListeners from './the-keyboard-listeners'
import TheMainListeners from './the-main-listeners'
import TheMenuManager from './the-menu-manager'
import TheStatusBar from './the-status-bar'
import TheUrlBar from './the-url-bar'

const TheApp: React.FC = () => {
  useEffect(() => {
    mainLog('App loaded')
  }, [])

  return (
    <RecoilRoot>
      <div className="h-screen w-screen select-none overflow-hidden text-grey-300 flex flex-col relative">
        <div className="flex-shrink-0 flex-grow p-4 border-b border-grey-900 relative">
          <TheUrlBar className="mb-4" />

          <div className="flex-shrink-0 flex flex-col justify-between">
            <TheBrowserButtons />
          </div>
        </div>

        <TheStatusBar className="flex-shrink-0" />

        <TheMenuManager />
        <TheKeyboardListeners />
        <TheMainListeners />
      </div>
    </RecoilRoot>
  )
}

export default TheApp
