import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { copyUrl, selectBrowser } from '../sendToMain'
import { useSelector, useShallowEqualSelector } from '../store'
import { pressedBackspaceKey, pressedEscapeKey } from '../store/actions'
import Noop from './noop'

const TheKeyboardListeners: React.FC = () => {
  const dispatch = useDispatch()
  const favBrowserId = useSelector((state) => state.mainStore.fav)
  const menu = useSelector((state) => state.ui.menu)
  const url = useSelector((state) => state.ui.url)
  const browsers = useShallowEqualSelector((state) => state.browsers)
  const hotkeys = useShallowEqualSelector((state) => state.mainStore.hotkeys)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isEscape = event.code === 'Escape'

      if (isEscape) {
        dispatch(pressedEscapeKey())
        return
      }

      // Bail out if hotkeys are disabled by menu being open
      if (menu) {
        return
      }

      const isBackspace = event.key === 'Backspace'

      if (isBackspace) {
        event.preventDefault()
        dispatch(pressedBackspaceKey())
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
  }, [url, browsers, favBrowserId, hotkeys, dispatch, menu])

  return <Noop />
}

export default TheKeyboardListeners
