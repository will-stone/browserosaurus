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
        'flex-grow flex flex-col items-center justify-center max-h-full',
        'focus:outline-none',
        'active:opacity-50',
        'group',
        className,
      )}
      onClick={handleClick}
      style={{
        maxWidth: '75px',
        maxHeight: '108px',
        flexBasis: 0,
      }}
      type="button"
    >
      <div className="overflow-hidden flex justify-center items-center">
        <img
          alt={app.name}
          className="object-contain w-full max-h-full"
          src={logos[app.id]}
        />
      </div>
      <Kbd className="flex-shrink-0 flex justify-center items-center group-hover:bg-grey-900 group-hover:text-grey-100 mt-2">
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
