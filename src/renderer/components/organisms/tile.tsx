import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { css } from 'emotion'
import React from 'react'
import ReactTooltip from 'react-tooltip'

import { logos } from '../../../config/logos'
import { App } from '../../../config/types'
import { getHotkeyByAppId } from '../../../utils/getHotkeyByAppId'
import { events, useStore } from '../../store'
import { themes } from '../../themes'
import Kbd from '../atoms/kbd'

const { clickedTileButton } = events

interface Props {
  app: App
  isFav?: boolean
  className?: string
}

const Tile: React.FC<Props> = ({ app, isFav, className }) => {
  const hotkeys = useStore((state) => state.mainStore.hotkeys)
  const theme = useStore((state) => state.mainStore.theme)

  const hotkey = getHotkeyByAppId(hotkeys, app.id)

  return (
    <>
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
        onClick={(event) =>
          clickedTileButton({
            appId: app.id,
            isAlt: event.altKey,
            isShift: event.shiftKey,
          })
        }
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
      </button>
      <ReactTooltip
        backgroundColor={themes[theme].tooltip.bg}
        effect="solid"
        id={app.id}
        place="bottom"
        textColor={themes[theme].tooltip.text}
      >
        {app.name}
      </ReactTooltip>
    </>
  )
}

export default Tile
