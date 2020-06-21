import React, { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { backspaceUrlParse } from '../../utils/backspaceUrlParse'
import { copyUrl, escapePressed, selectBrowser } from '../sendToMain'
import {
  areHotKeysEnabledSelector,
  browsersAtom,
  hotkeysAtom,
  openMenuSelector,
  urlSelector,
} from '../state'
import { useSelector } from '../store'
import Noop from './noop'

const TheKeyboardListeners: React.FC = () => {
  const [openMenu, setOpenMenu] = useRecoilState(openMenuSelector)
  const favBrowserId = useSelector((state) => state.mainStore.fav)
  const [url, setUrl] = useRecoilState(urlSelector)
  const browsers = useRecoilValue(browsersAtom)
  const areHotKeysEnabled = useRecoilValue(areHotKeysEnabledSelector)
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

      const isBackspace = event.key === 'Backspace'

      if (isBackspace) {
        event.preventDefault()
        setUrl(backspaceUrlParse(url))
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
    setUrl,
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
