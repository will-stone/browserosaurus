import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { copyUrl, hideWindow, selectApp } from '../../sendToMain'
import { AppThunk } from '../../store'
import { pressedBackspaceKey, pressedEscapeKey } from '../../store/actions'

const keyboardEvent = (event: KeyboardEvent): AppThunk => (
  dispatch,
  getState,
) => {
  const { url, menu, hotkeys, fav } = getState().ui

  // Using `fromCharCode` allows detection to be keyboard layout agnostic
  const stringFromCharCode = String.fromCharCode(event.keyCode).toLowerCase()

  // Favourite hotkeys
  // Enter and space can cause previously focussed items to activate so are
  // therefore always disabled.
  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault()
  }

  // Escape
  if (event.code === 'Escape') {
    dispatch(pressedEscapeKey())
  }

  // Only capture the following when menu is closed
  if (!menu) {
    // Escape
    if (event.code === 'Escape') {
      hideWindow()
    }

    // Backspace
    else if (event.key === 'Backspace') {
      event.preventDefault()
      dispatch(pressedBackspaceKey())
    }

    // ⌘C
    else if (event.metaKey && event.key.toLowerCase() === 'c') {
      event.preventDefault()
      if (url) {
        copyUrl(url)
        hideWindow()
      }
    }

    // App hotkey
    else if (!event.metaKey && stringFromCharCode.match(/^([a-z0-9])$/u)) {
      event.preventDefault()
      const appId = hotkeys[stringFromCharCode]
      if (appId) {
        selectApp({ url, appId, isAlt: event.altKey, isShift: event.shiftKey })
        hideWindow()
      }
    }

    // Favourite hotkeys
    else if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault()
      selectApp({
        url,
        appId: fav,
        isAlt: event.altKey,
        isShift: event.shiftKey,
      })
      hideWindow()
    }
  }
}

export const useKeyboardEvents = (): void => {
  const dispatch = useDispatch()

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      dispatch(keyboardEvent(event))
    }

    document.addEventListener('keydown', handler)

    return function cleanup() {
      document.removeEventListener('keydown', handler)
    }
  }, [dispatch])
}
