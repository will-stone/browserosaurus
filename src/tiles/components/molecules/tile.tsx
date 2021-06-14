import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'

import {
  changedHotkey,
  clickedEyeButton,
  clickedFavButton,
  clickedTile,
} from '../../../actions'
import { useSelector } from '../../store'
import { ExtendedApp } from '../../store/selector-hooks'
import AppLogo from '../atoms/app-logo'
import { EyeIcon, EyeOffIcon, StarIcon } from '../atoms/icons'
import Kbd from '../atoms/kbd'

interface Props {
  app: ExtendedApp
}

const Tile: React.FC<Props> = ({ app }) => {
  const dispatch = useDispatch()
  const url = useSelector((state) => state.ui.url)
  const isEditMode = useSelector((state) => state.ui.isEditMode)
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

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
          !isEditMode && 'hover:bg-black hover:bg-opacity-10',
        )}
        disabled={isEditMode}
        onClick={(event) =>
          !isEditMode &&
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
        <AppLogo app={app} wiggle={isEditMode} />

        {isEditMode && (
          <div className={clsx('flex-shrink-0')}>
            <input
              aria-label={`${app.name} hotkey`}
              className={clsx(
                'uppercase focus:outline-none min-w-0 w-full text-center rounded',
                'shadow bg-opacity-50',
                isDarkMode ? 'text-white bg-black' : 'text-black bg-white',
              )}
              data-app-id={app.id}
              maxLength={1}
              minLength={0}
              onChange={(event) => {
                dispatch(
                  changedHotkey({
                    appId: app.id,
                    value: event.currentTarget.value,
                  }),
                )
              }}
              onFocus={(event) => {
                event.target.select()
              }}
              placeholder="Key"
              type="text"
              value={app.hotkey || ''}
            />
          </div>
        )}

        {!isEditMode && (
          <Kbd className="flex-shrink-0 flex justify-center items-center space-x-2">
            {app.isFav && <StarIcon aria-label="Star" className="h-5 w-5" />}
            {app.hotkey && <span>{app.hotkey}</span>}

            {
              // Prevents box collapse when hotkey not set
              !app.hotkey && <span className="opacity-0 w-0">.</span>
            }
          </Kbd>
        )}
      </button>

      {isEditMode && (
        <button
          aria-label={`Favourite ${app.name}`}
          className={clsx(
            'absolute top-5 left-5',
            'flex justify-center items-center',
            'focus:outline-none shadow rounded-full h-8 w-8',
            isDarkMode ? 'bg-black' : 'bg-white',
            'bg-opacity-50',
          )}
          onClick={() => dispatch(clickedFavButton(app.id))}
          type="button"
        >
          <StarIcon className={clsx('h-5 w-5', !app.isFav && 'opacity-25')} />
        </button>
      )}

      {isEditMode && (
        <button
          className={clsx(
            'absolute top-5 right-5',
            'flex justify-center items-center',
            'focus:outline-none shadow rounded-full h-8 w-8',
            isDarkMode ? 'bg-black' : 'bg-white',
            'bg-opacity-50',
          )}
          onClick={() => dispatch(clickedEyeButton(app.id))}
          type="button"
        >
          {app.isVisible ? (
            <EyeIcon className="h-5 w-5" />
          ) : (
            <EyeOffIcon className="h-5 w-5 opacity-25" />
          )}
        </button>
      )}
    </div>
  )
}

export default Tile
