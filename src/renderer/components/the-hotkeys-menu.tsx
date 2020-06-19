import { faKeyboard } from '@fortawesome/pro-solid-svg-icons/faKeyboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cc from 'classcat'
import React, { useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { Hotkeys } from '../../main/store'
import { getHotkeyByBrowserId } from '../../utils/getHotkeyByBrowserId'
import { browsersAtom, hotkeysSelector } from '../state'

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

const TheHotkeysMenu: React.FC = () => {
  const browsers = useRecoilValue(browsersAtom)
  const [hotkeys, setHotkeys] = useRecoilState(hotkeysSelector)

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const browserId = event.currentTarget.name
      const key = event.currentTarget.value.toLowerCase()

      setHotkeys(alterHotkey(browserId, key))
    },
    [setHotkeys],
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
        <div className="mb-4 flex items-center justify-between">
          <FontAwesomeIcon className="text-green-400" icon={faKeyboard} />
          <span className="text-xxs text-grey-500">
            Assign single letters or numbers as hotkeys
          </span>
        </div>
        <div
          className="font-bold text-sm"
          style={{ columnCount: 3, pageBreakInside: 'avoid' }}
        >
          {browsers.map((browser) => {
            const hotkey =
              Object.keys(hotkeys).find((key) => hotkeys[key] === browser.id) ||
              ''
            return (
              <label
                key={browser.id}
                className={cc([
                  'inline-block w-full py-2 px-3 space-x-3 rounded',
                ])}
              >
                <input
                  className="w-10 h-8 bg-grey-600 text-grey-200 text-center rounded-full uppercase font-bold focus:outline-none"
                  maxLength={1}
                  minLength={0}
                  name={browser.id}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  type="text"
                  value={hotkey}
                />
                <span>{browser.name}</span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TheHotkeysMenu
