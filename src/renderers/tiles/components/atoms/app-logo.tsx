import clsx from 'clsx'
import React from 'react'

import { apps } from '../../../../config/apps'
import type { InstalledApp } from '../../../../shared/state/hooks'

interface Props extends React.ComponentPropsWithoutRef<'img'> {
  app: InstalledApp
}

const AppLogo = ({ app }: Props): JSX.Element => {
  return (
    <img
      alt={app.name}
      className={clsx('w-full object-contain', !app.isVisible && 'opacity-25')}
      src={apps[app.id].logo}
    />
  )
}

export default AppLogo
