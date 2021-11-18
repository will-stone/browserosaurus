import clsx from 'clsx'
import React from 'react'

import { apps } from '../../../../config/apps'
import type { InstalledApp } from '../../../../shared/state/hooks'

interface Props extends React.ComponentPropsWithoutRef<'img'> {
  app: InstalledApp
  className?: string
}

const AppLogo = ({ app, className }: Props): JSX.Element => {
  return (
    <img alt={app.name} className={clsx(className)} src={apps[app.id].logo} />
  )
}

export default AppLogo
