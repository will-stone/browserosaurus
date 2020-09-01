import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import React, { useCallback } from 'react'

import { logos } from '../../../config/logos'
import { App } from '../../../config/types'
import { getHotkeyByAppId } from '../../../utils/getHotkeyByAppId'
import { openApp } from '../../sendToMain'
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
        'focus:outline-none',
        'active:opacity-50',
        'group',
        className,
      )}
      onClick={handleClick}
      style={{
        maxWidth: isFav ? '100px' : '85px',
        height: isFav ? '134px' : '90px',
      }}
      type="button"
    >
      <div className="overflow-hidden flex justify-center items-center">
        <img
          alt={app.name}
          className={clsx('object-contain w-full max-h-full')}
          src={logos[app.id]}
        />
      </div>
      <div
        className="flex-shrink-0 mt-2 flex flex-col items-center"
        // To avoid logos growing into space when no hotkey
        style={{ minHeight: '1em' }}
      >
        <Kbd className="group-hover:bg-grey-900 group-hover:text-grey-100">
          {hotkey}
        </Kbd>

        {isFav && (
          <Kbd className="mt-1 space-x-1 group-hover:bg-grey-900 group-hover:text-grey-100">
            <FontAwesomeIcon
              className="text-yellow-400 align-text-top"
              icon={faStar}
            />
            <span>space</span>
          </Kbd>
        )}
      </div>
    </button>
  )
}

export default Tile
