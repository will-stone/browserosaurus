import clsx from 'clsx'
import React from 'react'

import { useSelector } from '../../../../shared/state/hooks'
import type { PrefsTab } from '../../../../shared/state/reducer.data'

interface Props {
  children: React.ReactNode
  pane: PrefsTab
  className?: string
}

export function Pane({ children, pane, className }: Props): JSX.Element {
  const prefsTab = useSelector((state) => state.data.prefsTab)
  const isVisible = pane === prefsTab

  return (
    <div
      className={clsx(
        isVisible ? 'flex-grow flex flex-col overflow-hidden' : 'hidden',
        className,
      )}
    >
      {children}
    </div>
  )
}
