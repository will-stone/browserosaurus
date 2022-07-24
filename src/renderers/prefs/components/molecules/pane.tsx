import clsx from 'clsx'

import type { PrefsTab } from '../../../../shared/state/reducer.data'
import { useSelector } from '../../../shared/state/hooks'

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
        isVisible ? 'flex grow flex-col overflow-hidden' : 'hidden',
        className,
      )}
    >
      {children}
    </div>
  )
}
