import clsx from 'clsx'
import React from 'react'

import type { InstalledApp } from '../../../shared/state/hooks'

interface Props extends React.ComponentPropsWithoutRef<'img'> {
  app: InstalledApp
  className?: string
}

const AppLogo = ({ app, className }: Props): JSX.Element | null => {
  return (
    <img
      alt=""
      className={clsx(className, 'no-drag')}
      data-testid={app.name}
      src={app.icon}
    />
  )
}

export default AppLogo
