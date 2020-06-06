import { faKeyboard } from '@fortawesome/pro-solid-svg-icons/faKeyboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cc from 'classcat'
import React, { useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { getHotkeyByBrowserId } from '../../utils/getHotkeyByBrowserId'
import { updateHotkeys } from '../sendToMain'
import { browsersAtom, hotkeysAtom } from '../state'

function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
  event.target.select()
}

const TheHotkeysMenu: React.FC = () => {
  const browsers = useRecoilValue(browsersAtom)
  const [hotkeys, setHotkeys] = useRecoilState(hotkeysAtom)

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const browserId = event.currentTarget.name
      const key = event.currentTarget.value.toLowerCase()

      // Delete key
      if (!key) {
        setHotkeys((currentHotkeys) => {
          const currentHotkeysCopy = { ...currentHotkeys }
          const oldKey = getHotkeyByBrowserId(currentHotkeysCopy, browserId)
          delete currentHotkeysCopy[oldKey || '']
          updateHotkeys(currentHotkeysCopy)
          return currentHotkeysCopy
        })
        return
      }

      const matchAlphaNumeric = key.match(/^([A-Za-z0-9])$/u)

      if (matchAlphaNumeric) {
        setHotkeys((currentHotkeys) => {
          const updatedHotkeys = { ...currentHotkeys, [key]: browserId }
          updateHotkeys(updatedHotkeys)
          return updatedHotkeys
        })
      }
    },
    [setHotkeys],
  )

  return (
    <div
      className="absolute bg-grey-800 rounded overflow-y-auto overflow-x-hidden border border-grey-600 shadow-xl z-30"
      style={{ top: '8px', right: '8px', bottom: '50px', left: '8px' }}
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
