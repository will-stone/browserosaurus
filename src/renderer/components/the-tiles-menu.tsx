import { faEye } from '@fortawesome/pro-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/pro-solid-svg-icons/faEyeSlash'
import { faGripHorizontal } from '@fortawesome/pro-solid-svg-icons/faGripHorizontal'
import { faKeyboard } from '@fortawesome/pro-solid-svg-icons/faKeyboard'
import { faStar } from '@fortawesome/pro-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cc from 'classcat'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { useSelector, useShallowEqualSelector } from '../store'
import {
  madeTileFav,
  toggledTileVisibility,
  updatedTileHotkey,
} from '../store/actions'
import Kbd from './kbd'

function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
  event.target.select()
}

const TheTilesMenu: React.FC = () => {
  const dispatch = useDispatch()
  const browsers = useShallowEqualSelector((state) => state.browsers)
  const hotkeys = useShallowEqualSelector((state) => state.mainStore.hotkeys)
  const favBrowserId = useSelector((state) => state.mainStore.fav)
  const hiddenTileIds = useShallowEqualSelector(
    (state) => state.mainStore.hiddenTileIds,
  )

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { browserId = '' } = event.currentTarget.dataset
      dispatch(
        updatedTileHotkey({
          browserId,
          value: event.currentTarget.value,
        }),
      )
    },
    [dispatch],
  )

  const handleFavClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const { browserId = '' } = event.currentTarget.dataset
      dispatch(madeTileFav(browserId))
    },
    [dispatch],
  )

  const handleVisibilityClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const { browserId = '' } = event.currentTarget.dataset
      dispatch(toggledTileVisibility(browserId))
    },
    [dispatch],
  )

  return (
    <div
      className={cc([
        'absolute bg-grey-800 rounded overflow-y-auto overflow-x-hidden border border-grey-600 shadow-xl z-30',
        'animate__animated animate__fadeInUp animate__faster',
      ])}
      style={{ top: '8px', right: '8px', bottom: '60px', left: '8px' }}
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
          {browsers.map((browser) => {
            const hotkey =
              Object.keys(hotkeys).find((key) => hotkeys[key] === browser.id) ||
              ''
            const isFav = favBrowserId === browser.id
            const isVisible = !hiddenTileIds.includes(browser.id)
            return (
              <div key={browser.id} className="space-x-3 flex items-center">
                <span className="inline-block mr-auto">{browser.name}</span>

                <button
                  aria-label={`Favourite ${browser.name}`}
                  className="flex-shrink-0 focus:outline-none"
                  data-browser-id={browser.id}
                  onClick={handleFavClick}
                  tabIndex={-1}
                  type="button"
                >
                  <FontAwesomeIcon
                    className={cc([
                      { 'text-yellow-400': isFav, 'text-grey-500': !isFav },
                    ])}
                    fixedWidth
                    icon={faStar}
                  />
                </button>

                <button
                  aria-label={`Toggle Visibility ${browser.name}`}
                  className="flex-shrink-0 focus:outline-none"
                  data-browser-id={browser.id}
                  onClick={handleVisibilityClick}
                  tabIndex={-1}
                  type="button"
                >
                  <FontAwesomeIcon
                    className={cc([
                      {
                        'text-purple-500': isVisible,
                        'text-grey-500': !isVisible,
                      },
                    ])}
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
                    data-browser-id={browser.id}
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
    </div>
  )
}

export default TheTilesMenu
