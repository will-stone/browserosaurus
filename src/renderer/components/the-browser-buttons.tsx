// import safariTechnologyPreview from '@browser-logos/safari-technology-preview/safari-technology-preview_256x256.png'
import React from 'react'
import { useRecoilValue } from 'recoil'

import { Browser } from '../../config/browsers'
import { browsersAtom } from '../atoms'
import BrowserButton from './browser-button'

const TheBrowserButtons: React.FC = () => {
  const browsers: Browser[] = useRecoilValue(browsersAtom)

  return (
    <div className="grid grid-cols-5 gap-4">
      {browsers.map((browser) => (
        <BrowserButton key={browser.id} browser={browser} />
      ))}
      {/* <BrowserButton
        browser={{
          name: 'Safari Technology Preview',
          id: 'com.apple.SafariTechnologyPreview',
          logo: safariTechnologyPreview,
        }}
      /> */}
    </div>
  )
}

export default TheBrowserButtons
