import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'

import { clickedApp } from '../../../../shared/state/actions'
import type { InstalledApp } from '../../../../shared/state/hooks'
import { useSelector } from '../../../../shared/state/hooks'

interface Props {
  app: InstalledApp
  children?: React.ReactNode
  className?: string
}

export const AppButton = React.forwardRef(
  (
    { children, app, className }: Props,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ): JSX.Element => {
    const dispatch = useDispatch()
    const url = useSelector((state) => state.data.url)

    return (
      <button
        key={app.id}
        ref={ref}
        aria-label={`${app.name} App`}
        className={clsx(
          'rounded-xl',
          'hover:bg-black hover:bg-opacity-10 border-0',
          'focus:outline-none',
          'focus:bg-white dark:focus:bg-black focus:bg-opacity-50 dark:focus:bg-opacity-30',
          'focus:shadow-xl',
          'focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500',
          'focus:hover:ring-black dark:focus:hover:ring-white',
          className,
        )}
        onClick={(event) =>
          dispatch(
            clickedApp({
              url,
              appId: app.id,
              isAlt: event.altKey,
              isShift: event.shiftKey,
            }),
          )
        }
        type="button"
      >
        {children}
      </button>
    )
  },
)

AppButton.displayName = 'AppButton'
