import clsx from 'clsx'
import React from 'react'

import { logos } from '../../../config/logos'
import { ExtendedApp } from '../../store/selector-hooks'

interface Props extends React.ComponentPropsWithoutRef<'img'> {
  app: ExtendedApp
  wiggle?: boolean
}

const AppLogo: React.FC<Props> = ({ app, wiggle }) => {
  return (
    <img
      alt={app.name}
      className={clsx(
        'w-full object-contain',
        !app.isVisible && 'opacity-25',
        wiggle && 'animate-wiggle',
      )}
      src={logos[app.id]}
    />
  )
}

export default AppLogo
