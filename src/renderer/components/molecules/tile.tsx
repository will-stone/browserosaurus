import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { faKeyboard } from '@fortawesome/free-solid-svg-icons/faKeyboard'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'

import { useSelector } from '../../store'
import {
  changedHotkey,
  clickedEyeButton,
  clickedFavButton,
  clickedTile,
} from '../../store/actions'
import { ExtendedApp } from '../../store/selector-hooks'
import AppLogo from '../atoms/app-logo'
import { Carrot } from '../atoms/carrot'
import Kbd from '../atoms/kbd'

interface Props {
  app: ExtendedApp
  controls: { favourite: boolean; hotkey: boolean; visibility: boolean }
}

const Tile: React.FC<Props> = ({ app, controls }) => {
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
        {
          // TODO what can be done so this isn't hardcoded?
          app.id === 'carrot' ? (
            <Carrot className="text-4xl" />
          ) : (
            <AppLogo app={app} wiggle={isEditMode} />
          )
        }

        {isEditMode && controls.hotkey && (
          <div
            className={clsx(
              'flex-shrink-0 flex justify-center items-center space-x-2',
            )}
          >
            <FontAwesomeIcon
              className="opacity-50"
              fixedWidth
              icon={faKeyboard}
            />
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
              type="text"
              value={app.hotkey || ''}
            />
          </div>
        )}

        {!isEditMode && controls.hotkey && (
          <Kbd className="flex-shrink-0 flex justify-center items-center space-x-2">
            {app.isFav && (
              <FontAwesomeIcon
                aria-label="Favourite"
                icon={faStar}
                role="img"
              />
            )}
            {app.hotkey && <span>{app.hotkey}</span>}

            {
              // Prevents box collapse when hotkey not set
              !app.hotkey && <span className="opacity-0 w-0">.</span>
            }
          </Kbd>
        )}

        {!controls.hotkey && <div className="opacity-50">{app.name}</div>}
      </button>

      {isEditMode && controls.favourite && (
        <button
          aria-label={`Favourite ${app.name}`}
          className={clsx(
            'absolute top-5 left-5',
            'flex justify-center items-center',
            'focus:outline-none shadow rounded-full h-8 w-8',
            isDarkMode ? 'bg-black' : 'bg-white',
            'bg-opacity-50',
            !app.isFav && 'text-sm',
          )}
          onClick={() => dispatch(clickedFavButton(app.id))}
          type="button"
        >
          <FontAwesomeIcon
            className={clsx(!app.isFav && 'opacity-25')}
            fixedWidth
            icon={faStar}
          />
        </button>
      )}

      {isEditMode && controls.visibility && (
        <button
          className={clsx(
            'absolute top-5 right-5',
            'flex justify-center items-center',
            'focus:outline-none shadow rounded-full h-8 w-8',
            isDarkMode ? 'bg-black' : 'bg-white',
            'bg-opacity-50',
            !app.isVisible && 'text-sm',
          )}
          onClick={() => dispatch(clickedEyeButton(app.id))}
          type="button"
        >
          <FontAwesomeIcon
            className={clsx(!app.isVisible && 'opacity-25')}
            fixedWidth
            icon={app.isVisible ? faEye : faEyeSlash}
          />
        </button>
      )}
    </div>
  )
}

export default Tile
