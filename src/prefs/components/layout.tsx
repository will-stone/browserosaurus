import React from 'react'

import { useApps } from '../../shared-state/selector-hooks'

const Layout = (): JSX.Element => {
  const apps = useApps()
  return (
    <div>
      <h1>hello</h1>
      <div>
        {apps.map(({ id, name }) => (
          <div key={id}>{name}</div>
        ))}
      </div>
    </div>
  )
}

export default Layout
