import { faEye } from '@fortawesome/free-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash'
import { faGripHorizontal } from '@fortawesome/free-solid-svg-icons/faGripHorizontal'
import { faKeyboard } from '@fortawesome/free-solid-svg-icons/faKeyboard'
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { useSelector, useShallowEqualSelector } from '../store'
import {
  madeTileFav,
  toggledTileVisibility,
  updatedTileHotkey,
} from '../store/actions'
import Kbd from './atoms/kbd'
import MouseDiv from './organisms/mouse-div'

function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
  event.target.select()
}

const TilesMenu: React.FC = () => {
  const dispatch = useDispatch()
  const apps = useShallowEqualSelector((state) => state.apps)
  const hotkeys = useShallowEqualSelector((state) => state.mainStore.hotkeys)
  const favAppId = useSelector((state) => state.mainStore.fav)
  const hiddenTileIds = useShallowEqualSelector(
    (state) => state.mainStore.hiddenTileIds,
  )

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { appId = '' } = event.currentTarget.dataset
      dispatch(
        updatedTileHotkey({
          appId,
          value: event.currentTarget.value,
        }),
      )
    },
    [dispatch],
  )

  const handleFavClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const { appId = '' } = event.currentTarget.dataset
      dispatch(madeTileFav(appId))
    },
    [dispatch],
  )

  const handleVisibilityClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const { appId = '' } = event.currentTarget.dataset
      dispatch(toggledTileVisibility(appId))
    },
    [dispatch],
  )

  return (
    <MouseDiv
      capture
      className={clsx(
        'absolute bg-grey-800 rounded overflow-y-auto overflow-x-hidden border-4 border-grey-600 shadow-xl z-30',
        'animate__animated animate__fadeInDown animate__faster',
      )}
      style={{ top: '0', right: '0', bottom: '0', left: '0' }}
    >
      <div className="p-4 grid grid-cols-2">
        <div className="space-y-3 text-xs">
          <FontAwesomeIcon fixedWidth icon={faGripHorizontal} />
          <div className="space-x-2">
            <FontAwesomeIcon
              className="text-yellow-400"
              fixedWidth
              icon={faStar}
            />
            <span>
              Assign <Kbd>space</Kbd> key
            </span>
          </div>
          <div className="space-x-2">
            <FontAwesomeIcon
              className="text-purple-500"
              fixedWidth
              icon={faEye}
            />
            <span>Show / hide</span>
          </div>
          <div className="space-x-2">
            <FontAwesomeIcon
              className="text-blue-400"
              fixedWidth
              icon={faKeyboard}
            />
            <span>Assign single letters or numbers as hotkeys</span>
          </div>
        </div>

        <div className="font-bold text-sm w-64 mx-auto space-y-3">
          {apps.map((app) => {
            const hotkey =
              Object.keys(hotkeys).find((key) => hotkeys[key] === app.id) || ''
            const isFav = favAppId === app.id
            const isVisible = !hiddenTileIds.includes(app.id)
            return (
              <div key={app.id} className="space-x-3 flex items-center">
                <span className="inline-block mr-auto">{app.name}</span>

                <button
                  aria-label={`Favourite ${app.name}`}
                  className="flex-shrink-0 focus:outline-none"
                  data-app-id={app.id}
                  onClick={handleFavClick}
                  tabIndex={-1}
                  type="button"
                >
                  <FontAwesomeIcon
                    className={isFav ? 'text-yellow-400' : 'text-grey-500'}
                    fixedWidth
                    icon={faStar}
                  />
                </button>

                <button
                  aria-label={`Toggle Visibility ${app.name}`}
                  className="flex-shrink-0 focus:outline-none"
                  data-app-id={app.id}
                  onClick={handleVisibilityClick}
                  tabIndex={-1}
                  type="button"
                >
                  <FontAwesomeIcon
                    className={isVisible ? 'text-purple-500' : 'text-grey-500'}
                    fixedWidth
                    icon={isVisible ? faEye : faEyeSlash}
                  />
                </button>

                <div className="flex-shrink-0 relative w-10 h-8 bg-grey-600 rounded-full">
                  {!hotkey && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                      <FontAwesomeIcon
                        className="text-blue-400"
                        fixedWidth
                        icon={faKeyboard}
                      />
                    </div>
                  )}
                  <input
                    className="bg-transparent w-full h-full absolute z-10 text-grey-200 text-center uppercase font-bold focus:outline-none"
                    data-app-id={app.id}
                    maxLength={1}
                    minLength={0}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    type="text"
                    value={hotkey}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </MouseDiv>
  )
}

export default TilesMenu
