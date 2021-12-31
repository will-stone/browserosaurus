import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import type { AppThunk } from '../../../../shared/state/reducer.root'
import {
  pressedAppKey,
  pressedBackspaceKey,
  pressedCopyKey,
  pressedEscapeKey,
} from '../../state/actions'

const keyboardEvent =
  (event: KeyboardEvent): AppThunk =>
  (dispatch, getState) => {
    const { url } = getState().data
    const { apps } = getState().storage

    const virtualKey = event.key.toLowerCase()
    const physicalKey = event.code

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
    else {
      const foundApp = apps.find((app) => app.hotCode === physicalKey)

      if (!event.metaKey && foundApp) {
        event.preventDefault()

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
