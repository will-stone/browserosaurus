import { faStar } from '@fortawesome/pro-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cc from 'classcat'
import React, { useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { browsersAtom, favBrowserIdSelector } from '../state'
import Kbd from './kbd'

const TheFavMenu: React.FC = () => {
  const browsers = useRecoilValue(browsersAtom)
  const [favBrowserId, setFavBrowserId] = useRecoilState(favBrowserIdSelector)

  const handleFavChange = useCallback(
    (
      event:
        | React.ChangeEvent<HTMLInputElement>
        | React.MouseEvent<HTMLInputElement, MouseEvent>,
    ) => {
      setFavBrowserId(event.currentTarget.value)
    },
    [setFavBrowserId],
  )

  return (
    <div
      className={cc([
        'absolute bg-grey-800 rounded overflow-y-auto overflow-x-hidden border border-grey-600 shadow-xl z-30',
        'animate__animated animate__fadeInUp animate__faster',
      ])}
      style={{ top: '8px', right: '50%', bottom: '60px', left: '8px' }}
    >
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <FontAwesomeIcon className="text-yellow-400" icon={faStar} />
          <span className="text-xxs text-grey-500">
            Assign <Kbd>space</Kbd> key
          </span>
        </div>
        <div
          className="font-bold text-sm"
          style={{ columnCount: 2, pageBreakInside: 'avoid' }}
        >
          {browsers.map((browser) => {
            return (
              <label
                key={browser.id}
                className={cc([
                  'inline-block w-full py-2 px-3 space-x-2 rounded',
                ])}
              >
                <input
                  checked={favBrowserId === browser.id}
                  name="browser-fav"
                  onChange={handleFavChange}
                  onClick={handleFavChange}
                  type="radio"
                  value={browser.id}
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

export default TheFavMenu
