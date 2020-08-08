import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import React, { useCallback } from 'react'

import { logos } from '../../config/logos'
import { App } from '../../config/types'
import { getHotkeyByAppId } from '../../utils/getHotkeyByAppId'
import { openApp } from '../sendToMain'
import { useSelector, useShallowEqualSelector } from '../store'
import Kbd from './atoms/kbd'

interface Props {
  app: App
  isFav: boolean
}

const Tile: React.FC<Props> = ({ app, isFav }) => {
  const url = useSelector((state) => state.ui.url)
  const hotkeys = useShallowEqualSelector((state) => state.mainStore.hotkeys)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      openApp({ url, appId: app.id, isAlt: event.altKey })
    },
    [app.id, url],
  )

  const hotkey = getHotkeyByAppId(hotkeys, app.id)

  return (
    <button
      key={app.id}
      aria-label={`${app.name} Tile`}
      className={clsx(
        isFav && 'flex-shrink-0',
        'flex flex-col items-center justify-center',
        'p-4',
        isFav ? 'w-28' : 'w-20',
        'focus:outline-none',
        'active:opacity-50',
      )}
      onClick={handleClick}
      type="button"
    >
      <img
        alt={app.name}
        className={clsx('mb-2 h-full w-full object-contain')}
        src={logos[app.id]}
      />
      {hotkey && <Kbd className="mb-1">{hotkey}</Kbd>}
      {isFav && (
        <Kbd className="space-x-1">
          <FontAwesomeIcon
            className="text-yellow-400 align-text-top"
            icon={faStar}
          />
          <span>space</span>
        </Kbd>
      )}
    </button>
  )
}

export default Tile
