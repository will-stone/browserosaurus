import cc from 'classcat'
import React from 'react'
import { useRecoilValue } from 'recoil'

import { browsersAtom } from '../state'
import BrowserButton from './browser-button'

const TheBrowserButtons: React.FC = () => {
  const browsers = useRecoilValue(browsersAtom)

  const threeCols = browsers.length <= 3 || browsers.length === 6
  const fourCols =
    browsers.length === 4 ||
    browsers.length === 7 ||
    browsers.length === 8 ||
    browsers.length === 11 ||
    browsers.length === 12
  const fiveCols =
    browsers.length === 5 ||
    browsers.length === 9 ||
    browsers.length === 10 ||
    browsers.length >= 13

  return (
    <div
      className={cc([
        'grid gap-4',
        { 'grid-cols-3': threeCols },
        { 'grid-cols-4': fourCols },
        { 'grid-cols-5': fiveCols },
      ])}
    >
      {browsers.map((browser) => (
        <BrowserButton key={browser.id} browser={browser} />
      ))}
    </div>
  )
}

export default TheBrowserButtons
