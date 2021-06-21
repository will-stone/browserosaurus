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
    <div className={clsx(className)}>
      <div
        className={clsx('flex justify-center items-center', 'h-8', 'draggable')}
      >
        Tiles
      </div>
      <div
        className={clsx('flex justify-center items-center space-x-12', 'h-16')}
      >
        <button
          className={clsx(
            prefsTab === 'general' && 'text-black dark:text-white',
            'focus:outline-none',
          )}
          onClick={() => dispatch(clickedTabButton('general'))}
          type="button"
        >
          General
        </button>
        <button
          className={clsx(
            prefsTab === 'tiles' && 'text-black dark:text-white',
            'focus:outline-none',
          )}
          onClick={() => dispatch(clickedTabButton('tiles'))}
          type="button"
        >
          Tiles
        </button>
        <button
          className={clsx(
            prefsTab === 'about' && 'text-black dark:text-white',
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
