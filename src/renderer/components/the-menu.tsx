import cc from 'classcat'
import React, { useCallback } from 'react'
import { useRecoilValue } from 'recoil'

import logo from '../assets/logo.png'
import { browsersAtom, favBrowserIdAtom } from '../atoms'
import { quit, setFav } from '../sendToMain'
import Version from './version'

const TheMenu: React.FC = () => {
  const browsers = useRecoilValue(browsersAtom)
  const favBrowserId = useRecoilValue(favBrowserIdAtom)

  const handleFavChange = useCallback((event) => {
    setFav(event.target.value)
  }, [])

  return (
    <div
      className="absolute top-0 left-0 right-0 p-1"
      style={{ bottom: '-16px' }}
    >
      <div className="w-full h-full bg-grey-800 rounded overflow-y-auto overflow-x-hidden border border-grey-300 shadow-xl">
        <div className="p-4 grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-grey-500 mb-2 font-semibold">Favourite</h2>
            <div className="font-bold text-sm">
              {browsers.map((browser, i) => {
                const isStriped = Boolean((i + 1) % 2)
                return (
                  <label
                    key={browser.id}
                    className={cc([
                      'block py-2 px-3 space-x-2 rounded',
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

          <div className="text-center">
            <img alt="logo" className="mx-auto w-24 h-24" src={logo} />
            <h1 className="text-2xl font-bold mb-2">Browserosaurus</h1>
            <p className="mb-4 text-xs text-grey-500 font-semibold">
              <Version />
            </p>
            <div>
              <button
                className={cc([
                  'bg-grey-700',
                  'border border-grey-900 rounded shadow-md active:shadow-none focus:outline-none',
                  'active:text-grey-200 font-bold',
                  'py-2 px-4 space-x-2',
                  'cursor-default',
                ])}
                onClick={quit}
                type="button"
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TheMenu
