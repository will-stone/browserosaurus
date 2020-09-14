import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { css } from 'emotion'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import { logos } from '../../../config/logos'
import { App } from '../../../config/types'
import { getHotkeyByAppId } from '../../../utils/getHotkeyByAppId'
import { useSelector, useShallowEqualSelector } from '../../store'
import { clickedTileButton } from '../../store/actions'
import { themes } from '../../themes'
import Kbd from '../atoms/kbd'

interface Props {
  app: App
  isFav?: boolean
  className?: string
}

const Tile: React.FC<Props> = ({ app, isFav, className }) => {
  const dispatch = useDispatch()
  const hotkeys = useShallowEqualSelector((state) => state.mainStore.hotkeys)
  const theme = useSelector((state) => state.mainStore.theme)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      dispatch(clickedTileButton({ appId: app.id, isAlt: event.altKey }))
    },
    [dispatch, app.id],
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
        css({
          color: themes[theme].tile.text,
          '&:hover': {
            backgroundColor: themes[theme].tile.bg.hover,
          },
        }),
        className,
      )}
      data-for={app.id}
      data-tip
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
            className={clsx('mr-2', css({ color: themes[theme].icons.star }))}
            icon={faStar}
            role="img"
          />
        )}
        {/* Prevents box collapse when hotkey not set */}
        {hotkey || <span className="opacity-0">.</span>}
      </Kbd>
      <ReactTooltip
        backgroundColor={themes[theme].tooltip.bg}
        effect="solid"
        id={app.id}
        place="bottom"
      >
        <span className={css({ color: themes[theme].tooltip.text })}>
          {app.name}
        </span>
      </ReactTooltip>
    </button>
  )
}

export default Tile
