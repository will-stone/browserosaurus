import { faKeyboard } from '@fortawesome/pro-solid-svg-icons/faKeyboard'
import { faStar } from '@fortawesome/pro-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cc from 'classcat'
import React, { useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { Hotkeys } from '../../main/store'
import { getHotkeyByBrowserId } from '../../utils/getHotkeyByBrowserId'
import { browsersAtom, favBrowserIdSelector, hotkeysSelector } from '../state'
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
  const browsers = useRecoilValue(browsersAtom)
  const [hotkeys, setHotkeys] = useRecoilState(hotkeysSelector)
  const [favBrowserId, setFavBrowserId] = useRecoilState(favBrowserIdSelector)

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const browserId = event.currentTarget.name
      const key = event.currentTarget.value.toLowerCase()

      setHotkeys(alterHotkey(browserId, key))
    },
    [setHotkeys],
  )

  const handleFavClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setFavBrowserId(event.currentTarget.name)
    },
    [setFavBrowserId],
  )

  return (
    <div
      className={cc([
        'absolute bg-grey-800 rounded overflow-y-auto overflow-x-hidden border border-grey-600 shadow-xl z-30',
        'animate__animated animate__fadeInUp animate__faster',
      ])}
      style={{ top: '8px', right: '8px', bottom: '60px', left: '8px' }}
    >
      <div className="p-4">
        <div className="mb-8 flex items-center justify-center space-x-4 text-xxs opacity-75">
          <span className="space-x-2">
            <FontAwesomeIcon className="text-yellow-400" icon={faStar} />
            <span>
              Assign <Kbd>space</Kbd> key
            </span>
          </span>
          <span className="opacity-25">|</span>
          <span className="space-x-2">
            <FontAwesomeIcon className="text-blue-400" icon={faKeyboard} />
            <span>Assign single letters or numbers as hotkeys</span>
          </span>
        </div>

        <div
          className="font-bold text-sm"
          style={{
            columnCount: 3,
            columnRule: '1px solid #0D1117',
            columnGap: '2rem',
          }}
        >
          {browsers.map((browser) => {
            const hotkey =
              Object.keys(hotkeys).find((key) => hotkeys[key] === browser.id) ||
              ''
            const isFav = favBrowserId === browser.id
            return (
              <div
                key={browser.id}
                className="space-x-3 mb-4 flex items-center"
                style={{ breakInside: 'avoid' }}
              >
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
                      { 'text-yellow-400': isFav, 'text-grey-600': !isFav },
                    ])}
                    icon={faStar}
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
