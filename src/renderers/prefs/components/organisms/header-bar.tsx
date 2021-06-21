import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'

import { clickedTabButton } from '../../../../shared/state/actions'
import { useSelector } from '../../../../shared/state/hooks'

interface Props {
  className?: string
}

export const HeaderBar = ({ className }: Props): JSX.Element => {
  const dispatch = useDispatch()
  const prefsTab = useSelector((state) => state.data.prefsTab)

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
        <button
          className={clsx(
            'bg-black dark:bg-white',
            prefsTab === 'general'
              ? 'text-black dark:text-white bg-opacity-10 dark:bg-opacity-10'
              : 'bg-opacity-0 dark:bg-opacity-0 hover:bg-opacity-5 dark:hover:bg-opacity-5',
            'px-4 py-2 rounded',
            'focus:outline-none',
          )}
          onClick={() => dispatch(clickedTabButton('general'))}
          type="button"
        >
          General
        </button>
        <button
          className={clsx(
            'bg-black dark:bg-white',
            prefsTab === 'tiles'
              ? 'text-black dark:text-white bg-opacity-10 dark:bg-opacity-10'
              : 'bg-opacity-0 dark:bg-opacity-0 hover:bg-opacity-5 dark:hover:bg-opacity-5',
            'px-4 py-2 rounded',
            'focus:outline-none',
          )}
          onClick={() => dispatch(clickedTabButton('tiles'))}
          type="button"
        >
          Tiles
        </button>
        <button
          className={clsx(
            'bg-black dark:bg-white',
            prefsTab === 'about'
              ? 'text-black dark:text-white bg-opacity-10 dark:bg-opacity-10'
              : 'bg-opacity-0 dark:bg-opacity-0 hover:bg-opacity-5 dark:hover:bg-opacity-5',
            'px-4 py-2 rounded',
            'focus:outline-none',
          )}
          onClick={() => dispatch(clickedTabButton('about'))}
          type="button"
        >
          About
        </button>
      </div>
    </div>
  )
}
