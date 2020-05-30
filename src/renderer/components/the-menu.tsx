import cc from 'classcat'
import React, { useCallback } from 'react'
import { useRecoilValue } from 'recoil'

import { browsersAtom } from '../atoms'
import { setFav } from '../sendToMain'

const TheMenu: React.FC = () => {
  const browsers = useRecoilValue(browsersAtom)
  const favBrowser = browsers[0]
  const sortedBrowsers = browsers
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))

  const handleFavChange = useCallback((event) => {
    setFav(event.target.value)
  }, [])

  return (
    <div className="absolute top-0 left-0 w-full h-full p-1">
      <div className="w-full h-full p-4 bg-grey-900 rounded overflow-y-auto overflow-x-hidden">
        <h2 className="text-grey-500 mb-2 font-semibold">Favourite</h2>
        <div className="font-bold text-sm">
          {sortedBrowsers.map((browser, i) => {
            const isStriped = Boolean((i + 1) % 2)
            return (
              <label
                key={browser.id}
                className={cc([
                  'block p-2 space-x-4',
                  { 'bg-grey-800': isStriped },
                ])}
              >
                <input
                  checked={favBrowser.id === browser.id}
                  className="align-text-top"
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
  )
}

export default TheMenu
