import * as mousetrap from 'mousetrap'
import { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'
import { OPT_TOGGLE, WINDOW_BLUR } from '../../config/events'

export const useOpt = (): boolean => {
  const [isOptHeld, setIsOptHeld] = useState<boolean>(false)

  useEffect(() => {
    ipcRenderer.on(WINDOW_BLUR, () => setIsOptHeld(false))
    mousetrap.bind(
      'alt',
      () => {
        ipcRenderer.send(OPT_TOGGLE, false)
        setIsOptHeld(false)
      },
      'keyup',
    )
    mousetrap.bind(
      'alt',
      () => {
        ipcRenderer.send(OPT_TOGGLE, true)
        setIsOptHeld(true)
      },
      'keydown',
    )
  }, [])

  return isOptHeld
}
