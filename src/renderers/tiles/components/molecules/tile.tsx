import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'

import { clickedTile } from '../../../../shared/state/actions'
import { ExtendedApp, useSelector } from '../../../../shared/state/hooks'
import { StarIcon } from '../../../shared/components/atoms/icons'
import AppLogo from '../atoms/app-logo'
import Kbd from '../atoms/kbd'

interface Props {
  app: ExtendedApp
}

const Tile: React.FC<Props> = ({ app }) => {
  const dispatch = useDispatch()
  const url = useSelector((state) => state.data.url)

  return (
    <div className="relative w-32">
      <button
        key={app.id}
        aria-label={`${app.name} Tile`}
        className={clsx(
          'w-full p-8',
          'flex flex-col items-center justify-center max-h-full',
          'focus:outline-none',
          'space-y-2',
          'hover:bg-black hover:bg-opacity-10',
        )}
        onClick={(event) =>
          dispatch(
            clickedTile({
              url,
              appId: app.id,
              isAlt: event.altKey,
              isShift: event.shiftKey,
            }),
          )
        }
        title={app.name}
        type="button"
      >
        <AppLogo app={app} />

        <Kbd className="flex-shrink-0 flex justify-center items-center space-x-2">
          {app.isFav && <StarIcon aria-label="Star" className="h-5 w-5" />}
          {app.hotkey && <span>{app.hotkey}</span>}

          {
            // Prevents box collapse when hotkey not set
            !app.hotkey && <span className="opacity-0 w-0">.</span>
          }
        </Kbd>
      </button>
    </div>
  )
}

export default Tile
