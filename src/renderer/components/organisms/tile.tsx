import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import React, { useCallback } from 'react'

import { logos } from '../../../config/logos'
import { App } from '../../../config/types'
import { getHotkeyByAppId } from '../../../utils/getHotkeyByAppId'
import { selectApp } from '../../sendToMain'
import { useSelector, useShallowEqualSelector } from '../../store'
import Kbd from '../atoms/kbd'

interface Props {
  app: App
  isFav?: boolean
  className?: string
}

const Tile: React.FC<Props> = ({ app, isFav, className }) => {
  const url = useSelector((state) => state.ui.url)
  const hotkeys = useShallowEqualSelector((state) => state.mainStore.hotkeys)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      selectApp({ url, appId: app.id, isAlt: event.altKey })
    },
    [app.id, url],
  )

  const hotkey = getHotkeyByAppId(hotkeys, app.id)

  return (
    <button
      key={app.id}
      aria-label={`${app.name} Tile`}
      className={clsx(
        'flex flex-col items-center justify-center max-h-full',
        'rounded',
        'focus:outline-none',
        'hover:bg-grey-900',
        className,
      )}
      onClick={handleClick}
      style={{
        maxWidth: '100px',
        minWidth: '50px',
      }}
      type="button"
    >
      <img
        alt={app.name}
        className="w-full object-contain"
        src={logos[app.id]}
      />
      <Kbd className="flex-shrink-0 flex justify-center items-center mt-2">
        {isFav && (
          <FontAwesomeIcon
            aria-label="Favourite"
            className="text-yellow-400 mr-2"
            icon={faStar}
            role="img"
          />
        )}
        {/* Prevents box collapse when hotkey not set */}
        {hotkey || <span className="opacity-0">.</span>}
      </Kbd>
    </button>
  )
}

export default Tile
