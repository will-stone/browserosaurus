import clsx from 'clsx'
import React from 'react'

import { ExtendedApp } from '../../store/selector-hooks'

interface Props extends React.ComponentPropsWithoutRef<'button'> {
  app: ExtendedApp
}

const AppButton: React.FC<Props> = ({
  app,
  disabled,
  onClick,
  children,
  className,
}) => {
  return (
    <button
      key={app.id}
      aria-label={`${app.name} Tile`}
      className={clsx(
        'w-full p-8',
        'flex flex-col items-center justify-center max-h-full',
        'focus:outline-none',
        'space-y-2',
        !disabled && 'hover:bg-black hover:bg-opacity-10',
        className,
      )}
      disabled={disabled}
      onClick={(event) => !disabled && onClick && onClick(event)}
      title={app.name}
      type="button"
    >
      {children}
    </button>
  )
}

export default AppButton
