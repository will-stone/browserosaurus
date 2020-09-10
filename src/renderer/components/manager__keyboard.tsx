import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useSelector } from '../store'
import {
  pressedAppKey,
  pressedBackspaceKey,
  pressedCopyKey,
  pressedEscapeKey,
} from '../store/actions'
import Noop from './atoms/noop'

const KeyboardManager: React.FC = () => {
  const dispatch = useDispatch()
  const menu = useSelector((state) => state.ui.menu)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // TODO move all this logic to middleware as an action:
      // dispatch(keyboardEvent(event))
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
        return
      }

      const isCopy = event.key.toLowerCase() === 'c' && event.metaKey

      if (isCopy) {
        event.preventDefault()
        dispatch(pressedCopyKey())
        return
      }

      const matchAlphaNumeric = event.key.toLowerCase().match(/^([a-z0-9])$/u)

      // App hotkey
      if (matchAlphaNumeric) {
        const key = matchAlphaNumeric[1]
        dispatch(pressedAppKey({ key, isAlt: event.altKey }))
        return
      }

      // Open favourite app
      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault()
        dispatch(pressedAppKey({ key: event.code, isAlt: event.altKey }))
      }
    }

    document.addEventListener('keydown', handler)

    return function cleanup() {
      document.removeEventListener('keydown', handler)
    }
  }, [dispatch, menu])

  return <Noop />
}

export default KeyboardManager
