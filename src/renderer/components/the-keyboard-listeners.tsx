import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

import { Browser } from '../../config/browsers'
import { browsersAtom } from '../atoms'
import { urlIdSelector } from '../selectors'
import { copyUrl, selectBrowser } from '../sendToMain'

const TheKeyboardListeners: React.FC = ({ children }) => {
  const urlId: string | undefined = useRecoilValue(urlIdSelector)
  const browsers: Browser[] = useRecoilValue(browsersAtom)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // TODO need a way to turn on and off keyboard entry when the
      // functionality requires it. Use an atom?
      const isCopy = event.code === 'KeyC' && event.metaKey

      if (isCopy) {
        event.preventDefault()
        copyUrl(urlId)
        return
      }

      let key: string | undefined
      let browserId: string | undefined
      const matchAlpha = event.code.match(/^Key([A-Z])$/u)

      if (matchAlpha) {
        key = matchAlpha[1].toLowerCase()
        browserId = browsers.find((browser) => browser.hotKey === key)?.id
      } else if (event.code === 'Space' || event.code === 'Enter') {
        key = event.code.toLowerCase()
        browserId = browsers[0].id
      }

      if (key && browserId) {
        event.preventDefault()
        selectBrowser(urlId, browserId, event.altKey)
      }
    }

    document.addEventListener('keydown', handler)

    return function cleanup() {
      document.removeEventListener('keydown', handler)
    }
  }, [urlId, browsers])

  return <div>{children}</div>
}

export default TheKeyboardListeners
