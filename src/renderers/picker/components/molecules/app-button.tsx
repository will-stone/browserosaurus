import clsx from 'clsx'
import { forwardRef } from 'react'
import { useDispatch } from 'react-redux'

import type { InstalledApp } from '../../../shared/state/hooks'
import { clickedApp } from '../../state/actions'

interface Props {
  app: InstalledApp
  children?: React.ReactNode
  className?: string
}

export const AppButton = forwardRef(
  (
    { children, app, className }: Props,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ): JSX.Element => {
    const dispatch = useDispatch()

    return (
      <button
        key={app.id}
        ref={ref}
        aria-label={`${app.name} App`}
        className={clsx(
          'hover:bg-neutral-100 dark:hover:bg-gray-700',
          'focus:bg-neutral-200 focus:outline-none dark:focus:bg-gray-900',
          className,
        )}
        onClick={(event) =>
          dispatch(
            clickedApp({
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
