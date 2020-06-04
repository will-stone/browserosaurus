import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import {
  areHotKeysEnabledAtom,
  browsersAtom,
  favBrowserIdAtom,
  hotkeysAtom,
} from '../atoms'
import { openMenuSelector, urlIdSelector } from '../selectors'
import { copyUrl, escapePressed, selectBrowser } from '../sendToMain'
import Noop from './noop'

const TheKeyboardListeners: React.FC = () => {
  const [openMenu, setOpenMenu] = useRecoilState(openMenuSelector)
  const favBrowserId = useRecoilValue(favBrowserIdAtom)
  const urlId = useRecoilValue(urlIdSelector)
  const browsers = useRecoilValue(browsersAtom)
  const areHotKeysEnabled = useRecoilValue(areHotKeysEnabledAtom)
  const hotkeys = useRecoilValue(hotkeysAtom)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isEscape = event.code === 'Escape'

      if (isEscape) {
        if (openMenu) {
          setOpenMenu(false)
        } else {
          escapePressed()
        }

        return
      }

      // Bail out if hotkeys are disabled
      if (!areHotKeysEnabled) {
        return
      }

      const isCopy = event.code === 'KeyC' && event.metaKey

      if (isCopy) {
        event.preventDefault()
        copyUrl(urlId)
        return
      }

      const matchAlphaNumeric = event.code.match(/^(?:Key|Digit)([A-Z0-9])$/u)

      // Browser hotkey
      if (matchAlphaNumeric) {
        const key = matchAlphaNumeric[1].toLowerCase()
        const browserId = hotkeys[key]
        selectBrowser(urlId, browserId, event.altKey)
        return
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
  }, [
    urlId,
    browsers,
    favBrowserId,
    openMenu,
    setOpenMenu,
    areHotKeysEnabled,
    hotkeys,
  ])

  return <Noop />
}

export default TheKeyboardListeners
