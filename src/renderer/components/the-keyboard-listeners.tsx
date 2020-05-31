import React, { useEffect } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { browsersAtom, favBrowserIdAtom, isUrlHistoryOpenAtom } from '../atoms'
import { urlIdSelector } from '../selectors'
import { copyUrl, escapePressed, selectBrowser } from '../sendToMain'

const TheKeyboardListeners: React.FC = ({ children }) => {
  const isUrlHistoryOpen = useRecoilValue(isUrlHistoryOpenAtom)
  const setIsUrlHistoryOpen = useSetRecoilState(isUrlHistoryOpenAtom)
  const favBrowserId = useRecoilValue(favBrowserIdAtom)
  const urlId = useRecoilValue(urlIdSelector)
  const browsers = useRecoilValue(browsersAtom)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // TODO need a way to turn on and off keyboard entry when the
      // functionality requires it. Use an atom?

      const isEscape = event.code === 'Escape'

      if (isEscape) {
        if (isUrlHistoryOpen) {
          setIsUrlHistoryOpen(false)
        } else {
          escapePressed()
        }

        return
      }

      const isCopy = event.code === 'KeyC' && event.metaKey

      if (isCopy) {
        event.preventDefault()
        copyUrl(urlId)
        return
      }

      const matchAlpha = event.code.match(/^Key([A-Z])$/u)

      // Browser hotkey
      if (matchAlpha) {
        const key = matchAlpha[1].toLowerCase()
        const browserId = browsers.find((browser) => browser.hotKey === key)?.id
        selectBrowser(urlId, browserId, event.altKey)
      }

      // Open favourite (first) browser
      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault()
        selectBrowser(urlId, favBrowserId, event.altKey)
      }
    }

    document.addEventListener('keydown', handler)

    return function cleanup() {
      document.removeEventListener('keydown', handler)
    }
  }, [urlId, browsers, setIsUrlHistoryOpen, isUrlHistoryOpen, favBrowserId])

  return <div>{children}</div>
}

export default TheKeyboardListeners
