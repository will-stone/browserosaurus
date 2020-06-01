/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import cc from 'classcat'
import React, { useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { browsersAtom, favBrowserIdAtom, isFavMenuOpenAtom } from '../atoms'
import { setFav } from '../sendToMain'
import Icon from './icon'

const TheFavMenu: React.FC = () => {
  const browsers = useRecoilValue(browsersAtom)
  const favBrowserId = useRecoilValue(favBrowserIdAtom)
  const setIsFavMenuOpen = useSetRecoilState(isFavMenuOpenAtom)

  const handleFavChange = useCallback(
    (event) => {
      setFav(event.target.value)
      setIsFavMenuOpen(false)
    },
    [setIsFavMenuOpen],
  )

  const handleBgClick = useCallback(() => {
    setIsFavMenuOpen(false)
  }, [setIsFavMenuOpen])

  const handleMenuClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation()
    },
    [],
  )

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 p-1 bg-grey-900 bg-opacity-50"
      onClick={handleBgClick}
      style={{ paddingBottom: '50px' }}
    >
      <div
        className="h-full w-1/2 bg-grey-800 rounded overflow-y-auto overflow-x-hidden border border-grey-300 shadow-xl"
        onClick={handleMenuClick}
      >
        <div className="p-4">
          <div className="text-yellow-400 mb-4 flex items-center justify-between">
            <Icon className="inline-block" icon="star" />
            <span className="text-xxs text-grey-500">
              Assign{' '}
              <kbd className="bg-grey-600 py-1 px-2 text-xxs font-bold uppercase rounded border border-grey-900 text-grey-300">
                space
              </kbd>{' '}
              key
            </span>
          </div>
          <div
            className="font-bold text-sm"
            style={{ columnCount: 2, pageBreakInside: 'avoid' }}
          >
            {browsers.map((browser, i) => {
              const isStriped = Boolean((i + 1) % 2)
              return (
                <label
                  key={browser.id}
                  className={cc([
                    'inline-block w-full py-2 px-3 space-x-2 rounded',
                    { 'bg-grey-700': isStriped },
                  ])}
                >
                  <input
                    checked={favBrowserId === browser.id}
                    name="browser-fav"
                    onChange={handleFavChange}
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
    </div>
  )
}

export default TheFavMenu
