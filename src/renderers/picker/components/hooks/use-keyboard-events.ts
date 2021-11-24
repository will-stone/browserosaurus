import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import {
  pressedAppKey,
  pressedBackspaceKey,
  pressedCopyKey,
  pressedEscapeKey,
} from '../../../../shared/state/actions'
import type { AppThunk } from '../../../../shared/state/reducer.root'

const keyboardEvent =
  (event: KeyboardEvent): AppThunk =>
  (dispatch, getState) => {
    const { url } = getState().data
    const { apps } = getState().storage

    const virtualKey = event.key.toLowerCase()
    // Not needed at the moment but useful to know
    // const physicalKey = event.code.toLowerCase()

    // Escape
    if (virtualKey === 'escape') {
      dispatch(pressedEscapeKey())
    }

    // Backspace
    if (virtualKey === 'backspace') {
      event.preventDefault()
      dispatch(pressedBackspaceKey())
    }

    // ⌘C
    else if (event.metaKey && virtualKey === 'c') {
      event.preventDefault()
      if (url) {
        dispatch(pressedCopyKey(url))
      }
    }

    // App hotkey
    else if (!event.metaKey && /^([a-z0-9])$/u.test(virtualKey)) {
      event.preventDefault()
      const foundApp = apps.find((app) => app.hotkey === virtualKey)
      if (foundApp) {
        dispatch(
          pressedAppKey({
            url,
            appId: foundApp.id,
            isAlt: event.altKey,
            isShift: event.shiftKey,
          }),
        )
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
