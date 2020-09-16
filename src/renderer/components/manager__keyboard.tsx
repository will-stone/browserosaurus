import React, { useEffect } from 'react'

import { events, useStore } from '../store'
import Noop from './atoms/noop'

const {
  pressedAppKey,
  pressedBackspaceKey,
  pressedCopyKey,
  pressedEscapeKey,
} = events

const KeyboardManager: React.FC = () => {
  const menu = useStore((state) => state.ui.menu)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // TODO move all this logic to middleware as an action:
      // dispatch(keyboardEvent(event))
      const isEscape = event.code === 'Escape'

      if (isEscape) {
        pressedEscapeKey()
        return
      }

      // Bail out if hotkeys are disabled by menu being open
      if (menu) {
        return
      }

      const isBackspace = event.key === 'Backspace'

      if (isBackspace) {
        event.preventDefault()
        pressedBackspaceKey()
        return
      }

      const isCopy = event.key.toLowerCase() === 'c' && event.metaKey

      if (isCopy) {
        event.preventDefault()
        pressedCopyKey()
        return
      }

      // Using `fromCharCode` allows detection to be keyboard layout agnostic
      const matchAlphaNumeric = String.fromCharCode(event.keyCode)
        .toLowerCase()
        .match(/^([a-z0-9])$/u)

      // App hotkey
      if (matchAlphaNumeric) {
        const key = matchAlphaNumeric[1]
        pressedAppKey({ key, isAlt: event.altKey })
        return
      }

      // Open favourite app
      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault()
        pressedAppKey({ key: event.code, isAlt: event.altKey })
      }
    }

    document.addEventListener('keydown', handler)

    return function cleanup() {
      document.removeEventListener('keydown', handler)
    }
  }, [menu])

  return <Noop />
}

export default KeyboardManager
