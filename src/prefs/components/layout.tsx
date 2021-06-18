import clsx from 'clsx'
import React from 'react'

import { useApps, useSelector } from '../../shared-state/hooks'
import { HeaderBar } from './organisms/header-bar'

const Layout = (): JSX.Element => {
  const apps = useApps()
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

  return (
    <div
      className={clsx(
        'flex flex-col max-h-screen',
        isDarkMode ? 'text-gray-400' : 'text-gray-700',
      )}
    >
      <HeaderBar className="flex-shrink-0" />
      <div className="flex-grow overflow-y-auto">
        <div className="p-8">
          {apps.map(({ id, name }) => (
            <div key={id}>{name}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Layout
