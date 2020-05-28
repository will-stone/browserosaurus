import cc from 'classcat'
import React from 'react'
import { useRecoilValue } from 'recoil'

import { Browser } from '../../config/browsers'
import { browsersAtom } from '../atoms'
import BrowserButton from './browser-button'

const TheBrowserButtons: React.FC = () => {
  const browsers: Browser[] = useRecoilValue(browsersAtom)
  const remainder = browsers.length % 5

  return (
    <div
      className={cc([
        'grid gap-4',
        { 'grid-cols-3': browsers.length <= 3 || remainder === 1 },
        {
          'grid-cols-4':
            browsers.length === 4 || (browsers.length > 5 && remainder === 2),
        },
        {
          'grid-cols-5':
            browsers.length >= 5 && (remainder === 0 || remainder >= 3),
        },
      ])}
    >
      {browsers.map((browser) => (
        <BrowserButton key={browser.id} browser={browser} />
      ))}
    </div>
  )
}

export default TheBrowserButtons
