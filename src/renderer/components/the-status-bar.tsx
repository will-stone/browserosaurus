import cc from 'classcat'
import React, { useCallback } from 'react'
import { useRecoilState } from 'recoil'

import { openMenuAtom } from '../atoms'
import { quit } from '../sendToMain'
import Icon from './icon'
import Version from './version'

interface Props {
  className?: string
}

const TheStatusBar: React.FC<Props> = ({ className }) => {
  const [openMenu, setOpenMenu] = useRecoilState(openMenuAtom)

  const handleFavMenuClick = useCallback(() => {
    setOpenMenu(openMenu === 'fav' ? false : 'fav')
  }, [openMenu, setOpenMenu])

  return (
    <div
      className={cc([
        className,
        'h-16 px-4 bg-grey-700 flex items-center justify-between overflow-hidden text-xs font-bold space-x-4',
      ])}
    >
      <button
        className={cc([
          'bg-grey-600',
          'border border-grey-900 rounded shadow-md active:shadow-none focus:outline-none',
          'text-xs active:text-grey-200 font-bold',
          'py-1 px-2',
          'cursor-default',
          { 'z-30': openMenu === 'fav' },
        ])}
        onClick={handleFavMenuClick}
        type="button"
      >
        {openMenu === 'fav' ? <Icon icon="cross" /> : <Icon icon="star" />}
      </button>

      <Version className="text-grey-500" />

      <button
        className={cc([
          'bg-grey-600',
          'border border-grey-900 rounded shadow-md active:shadow-none focus:outline-none',
          'text-xs active:text-grey-200 font-bold',
          'py-1 px-2',
          'cursor-default',
        ])}
        onClick={quit}
        type="button"
      >
        <Icon icon="exit" />
      </button>
    </div>
  )
}

export default TheStatusBar
