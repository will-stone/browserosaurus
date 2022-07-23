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
          ? 'text-black dark:text-white bg-opacity-10 dark:bg-opacity-10'
          : 'bg-opacity-0 dark:bg-opacity-0 hover:bg-opacity-5 dark:hover:bg-opacity-5',
        'focus-visible:outline-none focus-visible:bg-white dark:focus-visible:bg-black focus-visible:bg-opacity-70 focus-visible:shadow-xl focus-visible:ring-1 focus-visible:ring-gray-500',
        'px-4 py-2 rounded',
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
        'bg-black bg-opacity-5 dark:bg-opacity-30 pb-4 border-b border-gray-400 dark:border-black',
        className,
      )}
    >
      <div className="flex justify-center items-center h-8 draggable pt-4 pb-8">
        Browserosaurus Preferences
      </div>
      <div className="flex justify-center items-center space-x-12">
        <TabButton tab="general">General</TabButton>
        <TabButton tab="apps">Apps</TabButton>
        <TabButton tab="about">About</TabButton>
      </div>
    </div>
  )
}
