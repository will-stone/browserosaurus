import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { css } from 'emotion'
import React from 'react'
import { useDispatch } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import { logos } from '../../../config/logos'
import { hideWindow, selectApp } from '../../sendToMain'
import { AppThunk } from '../../store'
import { ExtendedApp, useTheme } from '../../store/selector-hooks'
import { themes } from '../../themes'
import Kbd from '../atoms/kbd'

const clickedTileButton = (
  appId: string,
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
): AppThunk => (_, getState) => {
  selectApp({
    url: getState().ui.url,
    appId,
    isAlt: event.altKey,
    isShift: event.shiftKey,
  })
  hideWindow()
}

interface Props {
  app: ExtendedApp
  isFav?: boolean
  className?: string
}

const Tile: React.FC<Props> = ({ app, isFav, className }) => {
  const dispatch = useDispatch()
  const theme = useTheme()

  return (
    <>
      <button
        key={app.id}
        aria-label={`${app.name} Tile`}
        className={clsx(
          '-mt-4',
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
        onClick={(event) => dispatch(clickedTileButton(app.id, event))}
        style={{
          maxWidth: '90px',
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
          {app.hotkey || <span className="opacity-0">.</span>}
        </Kbd>
      </button>
      <ReactTooltip
        backgroundColor="transparent"
        effect="solid"
        id={app.id}
        overridePosition={({ left, top }) => ({ left, top: top - 12 })}
        place="bottom"
        textColor={themes[theme].tooltip.text}
      >
        {app.name}
      </ReactTooltip>
    </>
  )
}

export default Tile
