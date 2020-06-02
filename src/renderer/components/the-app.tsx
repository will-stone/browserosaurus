import cc from 'classcat'
import React, { useCallback, useEffect } from 'react'
import { useRecoilState } from 'recoil'

import { openMenuAtom } from '../atoms'
import { mainLog, quit } from '../sendToMain'
import Icon from './icon'
import TheBrowserButtons from './the-browser-buttons'
import TheKeyboardListeners from './the-keyboard-listeners'
import TheMainListeners from './the-main-listeners'
import TheMenuManager from './the-menu-manager'
import TheUrlBar from './the-url-bar'
import Version from './version'

const TheApp: React.FC = () => {
  const [openMenu, setOpenMenu] = useRecoilState(openMenuAtom)

  const handleMenuClick = useCallback(() => {
    setOpenMenu(openMenu === 'fav' ? false : 'fav')
  }, [openMenu, setOpenMenu])

  useEffect(() => {
    mainLog('App loaded')
  }, [])

  return (
    <div className="h-screen w-screen select-none overflow-hidden text-grey-300 flex flex-col relative">
      <div className="flex-shrink-0 flex-grow p-4 border-b border-grey-900 relative">
        <TheUrlBar className="mb-4" />

        <div className="flex-shrink-0 flex flex-col justify-between">
          <TheBrowserButtons />
        </div>
      </div>

      <div className="flex-shrink-0 h-16 px-4 bg-grey-700 flex items-center justify-between overflow-hidden text-xs font-bold space-x-4">
        <button
          className={cc([
            'bg-grey-600',
            'border border-grey-900 rounded shadow-md active:shadow-none focus:outline-none',
            'text-xs active:text-grey-200 font-bold',
            'py-1 px-2',
            'cursor-default',
            { 'z-30': openMenu === 'fav' },
          ])}
          onClick={handleMenuClick}
          type="button"
        >
          {openMenu === 'fav' ? <Icon icon="cross" /> : <Icon icon="star" />}
        </button>

        <Version className="text-grey-500" />

        <button
          className={cc([
            'bg-grey-600',
            'border border-grey-900 rounded shadow-md active:shadow-none focus:outline-none',
            'text-xs active:text-grey-200 font-bold',
            'py-1 px-2',
            'cursor-default',
          ])}
          onClick={quit}
          type="button"
        >
          <Icon icon="exit" />
        </button>
      </div>

      <TheMenuManager />
      <TheKeyboardListeners />
      <TheMainListeners />
    </div>
  )
}

export default TheApp
