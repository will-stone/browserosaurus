import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { copyUrl, escapePressed, selectBrowser } from '../sendToMain'
import {
  areHotKeysEnabledAtom,
  browsersAtom,
  favBrowserIdAtom,
  hotkeysAtom,
  openMenuSelector,
  urlSelector,
} from '../state'
import Noop from './noop'

const TheKeyboardListeners: React.FC = () => {
  const [openMenu, setOpenMenu] = useRecoilState(openMenuSelector)
  const favBrowserId = useRecoilValue(favBrowserIdAtom)
  const url = useRecoilValue(urlSelector)
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

      const isCopy = event.key.toLowerCase() === 'c' && event.metaKey

      if (isCopy) {
        event.preventDefault()
        copyUrl(url)
        return
      }

      const matchAlphaNumeric = event.key.toLowerCase().match(/^([a-z0-9])$/u)

      // Browser hotkey
      if (matchAlphaNumeric) {
        const key = matchAlphaNumeric[1]
        const browserId = hotkeys[key]
        selectBrowser(url, browserId, event.altKey)
        return
      }

      // Open favourite (first) browser
      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault()
        selectBrowser(url, favBrowserId, event.altKey)
      }
    }

    document.addEventListener('keydown', handler)

    return function cleanup() {
      document.removeEventListener('keydown', handler)
    }
  }, [
    url,
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
