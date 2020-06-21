import { faEye } from '@fortawesome/pro-solid-svg-icons/faEye'
import { faEyeSlash } from '@fortawesome/pro-solid-svg-icons/faEyeSlash'
import { faGripHorizontal } from '@fortawesome/pro-solid-svg-icons/faGripHorizontal'
import { faKeyboard } from '@fortawesome/pro-solid-svg-icons/faKeyboard'
import { faStar } from '@fortawesome/pro-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cc from 'classcat'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useRecoilState, useRecoilValue } from 'recoil'

import { Hotkeys } from '../../main/store'
import { getHotkeyByBrowserId } from '../../utils/getHotkeyByBrowserId'
import { updateHiddenTileIds, updateHotkeys } from '../sendToMain'
import { browsersAtom, hiddenTileIdsAtom, hotkeysAtom } from '../state'
import { useSelector } from '../store'
import { updateFavClicked } from '../store/actions'
import Kbd from './kbd'

function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
  event.target.select()
}

// Update a hotkeys object based on incoming browser ID and hotkey combo
const alterHotkey = (browserId: string, hotkey: string) => (
  hotkeys: Hotkeys,
) => {
  // Do not alter original hotkeys object
  const hotkeysCopy = { ...hotkeys }
  // Find the previous key for this browser
  const oldKey = getHotkeyByBrowserId(hotkeysCopy, browserId)
  // If the new hotkey is empty, it's a deletion and so remove the current entry
  if (!hotkey) {
    delete hotkeysCopy[oldKey || '']
    return hotkeysCopy
  }

  // If the new key is allowed, delete the previous entry and add new entry
  const matchAlphaNumeric = hotkey.match(/^([A-Za-z0-9])$/u)
  if (matchAlphaNumeric) {
    delete hotkeysCopy[oldKey || '']
    return { ...hotkeysCopy, [hotkey]: browserId }
  }

  // Else change nothing and return the original
  return hotkeys
}

const TheTilesMenu: React.FC = () => {
  const dispatch = useDispatch()
  const browsers = useRecoilValue(browsersAtom)
  const [hotkeys, setHotkeys] = useRecoilState(hotkeysAtom)
  const favBrowserId = useSelector((state) => state.mainStore.fav)
  const [hiddenTileIds, setHiddenTileIds] = useRecoilState(hiddenTileIdsAtom)

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const browserId = event.currentTarget.name
      const key = event.currentTarget.value.toLowerCase()

      const updatedHotkeys = alterHotkey(browserId, key)(hotkeys)

      updateHotkeys(updatedHotkeys)
      setHotkeys(updatedHotkeys)
    },
    [setHotkeys, hotkeys],
  )

  const handleFavClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      dispatch(updateFavClicked(event.currentTarget.name))
    },
    [dispatch],
  )

  const handleVisibilityClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const theId = event.currentTarget.name

      // Remove the id if it exists in the array
      const updatedHiddenTileIds = hiddenTileIds.filter((id) => id !== theId)

      // If no id was removed, it didn't exist to begin with and should be added
      if (updatedHiddenTileIds.length === hiddenTileIds.length) {
        updatedHiddenTileIds.push(theId)
      }

      updateHiddenTileIds(updatedHiddenTileIds)
      setHiddenTileIds(updatedHiddenTileIds)
    },
    [setHiddenTileIds, hiddenTileIds],
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
                  className="flex-shrink-0 focus:outline-none"
                  name={browser.id}
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
                  className="flex-shrink-0 focus:outline-none"
                  name={browser.id}
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
                    maxLength={1}
                    minLength={0}
                    name={browser.id}
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
