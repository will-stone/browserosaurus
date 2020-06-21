import cc from 'classcat'
import React from 'react'
import { useRecoilValue } from 'recoil'

import { browsersAtom, hiddenTileIdsSelector } from '../state'
import BrowserButton from './browser-button'

const TheBrowserButtons: React.FC = () => {
  const browsers = useRecoilValue(browsersAtom)
  const hiddenTileIds = useRecoilValue(hiddenTileIdsSelector)
  const visibleBrowsers = browsers.filter((b) => !hiddenTileIds.includes(b.id))

  const threeCols = visibleBrowsers.length <= 3 || visibleBrowsers.length === 6
  const fourCols =
    visibleBrowsers.length === 4 ||
    visibleBrowsers.length === 7 ||
    visibleBrowsers.length === 8 ||
    visibleBrowsers.length === 11 ||
    visibleBrowsers.length === 12
  const fiveCols =
    visibleBrowsers.length === 5 ||
    visibleBrowsers.length === 9 ||
    visibleBrowsers.length === 10 ||
    visibleBrowsers.length >= 13

  return (
    <div
      className={cc([
        'grid gap-4',
        { 'grid-cols-3': threeCols },
        { 'grid-cols-4': fourCols },
        { 'grid-cols-5': fiveCols },
      ])}
    >
      {visibleBrowsers.map((browser) => (
        <BrowserButton key={browser.id} browser={browser} />
      ))}
    </div>
  )
}

export default TheBrowserButtons
