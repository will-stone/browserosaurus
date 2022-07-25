import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { pressedKey } from '../../state/actions'

export const useKeyboardEvents = (): void => {
  const dispatch = useDispatch()

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (['Tab', 'Enter', 'Space'].includes(event.code)) {
        return
      }

      event.preventDefault()

      dispatch(
        pressedKey({
          virtualKey: event.key.toLowerCase(),
          physicalKey: event.code,
          metaKey: event.metaKey,
          altKey: event.altKey,
          shiftKey: event.shiftKey,
        }),
      )
    }

    document.addEventListener('keydown', handler)

    return function cleanup() {
      document.removeEventListener('keydown', handler)
    }
  }, [dispatch])
}
