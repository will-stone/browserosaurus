import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { css } from 'emotion'
import React from 'react'
import { useDispatch } from 'react-redux'

import { logos } from '../../../config/logos'
import { useSelector } from '../../store'
import { clickedTile } from '../../store/actions'
import { ExtendedApp, useTheme } from '../../store/selector-hooks'
import { themes } from '../../themes'
import Kbd from '../atoms/kbd'

interface Props {
  app: ExtendedApp
  isFav?: boolean
  className?: string
}

const Tile: React.FC<Props> = ({ app, isFav, className }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const url = useSelector((state) => state.ui.url)

  return (
    <button
      key={app.id}
      aria-label={`${app.name} Tile`}
      className={clsx(
        'w-32 h-32 p-8',
        'flex flex-col items-center justify-center max-h-full',
        'rounded',
        'focus:outline-none',
        css({
          color: themes[theme].tile.text,
        }),
        className,
      )}
      data-for={app.id}
      data-tip
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
      <img
        alt={app.name}
        className="w-full object-contain"
        src={logos[app.id]}
      />
      <Kbd className="flex-shrink-0 flex justify-center items-center mt-2">
        {isFav && (
          <FontAwesomeIcon
            aria-label="Favourite"
            className={css({ color: themes[theme].icons.star })}
            icon={faStar}
            role="img"
          />
        )}
        {app.hotkey ? (
          <span className="ml-2">{app.hotkey}</span>
        ) : (
          // Prevents box collapse when hotkey not set
          <span className="opacity-0 w-0">.</span>
        )}
      </Kbd>
    </button>
  )
}

export default Tile
