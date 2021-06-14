import React from 'react'

import { useApps } from '../../shared-state/hooks'
import { TitleBar } from './organisms/title-bar'

const Layout = (): JSX.Element => {
  const apps = useApps()
  return (
    <div className="flex flex-col max-h-screen">
      <TitleBar className="flex-shrink-0" />
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
