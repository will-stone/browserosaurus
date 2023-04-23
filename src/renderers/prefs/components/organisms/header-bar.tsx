import clsx from 'clsx'
import { useDispatch } from 'react-redux'

import type { PrefsTab } from '../../../../shared/state/reducer.data'
import { useSelector } from '../../../shared/state/hooks'
import { clickedTabButton } from '../../state/actions'

interface TabButtonProps {
  tab: PrefsTab
  children: string
}

const TabButton = ({ tab, children }: TabButtonProps) => {
  const dispatch = useDispatch()
  const prefsTab = useSelector((state) => state.data.prefsTab)

  return (
    <button
      className={clsx(
        'bg-black dark:bg-white',
        prefsTab === tab
          ? 'bg-black/10 text-black dark:bg-white/10 dark:text-white'
          : 'bg-black/0 hover:bg-black/5 dark:bg-white/0 dark:hover:bg-white/5',
        'focus-visible:bg-white/70 focus-visible:shadow-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-500 dark:focus-visible:bg-black',
        'rounded px-4 py-2',
      )}
      onClick={() => dispatch(clickedTabButton(tab))}
      type="button"
    >
      {children}
    </button>
  )
}

interface HeaderBarProps {
  className?: string
}

export const HeaderBar = ({ className }: HeaderBarProps): JSX.Element => {
  return (
    <div
      className={clsx(
        'border-b border-gray-400 bg-black/5 pb-4 dark:border-black dark:bg-black/30',
        className,
      )}
    >
      <div className="draggable flex h-8 items-center justify-center pb-8 pt-4">
        Browserosaurus Preferences
      </div>
      <div className="flex items-center justify-center space-x-12">
        <TabButton tab="general">General</TabButton>
        <TabButton tab="apps">Apps</TabButton>
        <TabButton tab="about">About</TabButton>
      </div>
    </div>
  )
}
