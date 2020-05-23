import cc from 'classcat'
import React from 'react'
import { useRecoilValue } from 'recoil'

import { Browser } from '../../config/browsers'
import { browsersState } from '../store/atoms'
import BrowserButton from './browser-button'

const TheBrowserButtons: React.FC = () => {
  const browsers: Browser[] = useRecoilValue(browsersState)

  return (
    <div className="grid grid-cols-2 gap-4">
      {browsers.map((browser, i) => (
        <BrowserButton
          key={browser.id}
          browser={browser}
          className={cc({ 'col-span-2': i === 0 })}
        />
      ))}
    </div>
  )
}

export default TheBrowserButtons
