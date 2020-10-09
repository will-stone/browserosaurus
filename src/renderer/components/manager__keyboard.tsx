// TODO turn this into a hook
import { createAction } from '@reduxjs/toolkit'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { copyUrl, hideWindow, selectApp } from '../sendToMain'
import { AppThunk } from '../store'
import Noop from './atoms/noop'

export const pressedEscapeKey = createAction('keyboardManager/pressedEscapeKey')
export const pressedBackspaceKey = createAction(
  'keyboardManager/pressedBackspaceKey',
)

const keyboardEvent = (event: KeyboardEvent): AppThunk => (
  dispatch,
  getState,
) => {
  const { url, menu, hotkeys, fav } = getState().ui

  const isEscape = event.code === 'Escape'

  if (isEscape) {
    // Hide window if no menus are open
    if (!menu) {
      hideWindow()
    }

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
    if (url) {
      copyUrl(url)
      hideWindow()
    }

    return
  }

  // Using `fromCharCode` allows detection to be keyboard layout agnostic
  const matchAlphaNumeric = String.fromCharCode(event.keyCode)
    .toLowerCase()
    .match(/^([a-z0-9])$/u)

  // App hotkey
  if (matchAlphaNumeric) {
    const key = matchAlphaNumeric[1]
    const appId = hotkeys[key]
    if (appId) {
      selectApp({ url, appId, isAlt: event.altKey, isShift: event.shiftKey })
      hideWindow()
    }

    return
  }

  // Open favourite app
  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault()
    selectApp({ url, appId: fav, isAlt: event.altKey, isShift: event.shiftKey })
    hideWindow()
  }
}

const KeyboardManager: React.FC = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const handler = (event: KeyboardEvent) => dispatch(keyboardEvent(event))

    document.addEventListener('keydown', handler)

    return function cleanup() {
      document.removeEventListener('keydown', handler)
    }
  }, [dispatch])

  return <Noop />
}

export default KeyboardManager
