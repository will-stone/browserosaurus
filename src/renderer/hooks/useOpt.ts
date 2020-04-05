import { ipcRenderer } from 'electron'
import * as mousetrap from 'mousetrap'
import { useEffect } from 'react'

import { OPT_TOGGLE } from '../../config/events'

const useOpt = (): void => {
  useEffect(() => {
    mousetrap.bind(
      'alt',
      () => {
        ipcRenderer.send(OPT_TOGGLE, false)
      },
      'keyup',
    )
    mousetrap.bind(
      'alt',
      () => {
        ipcRenderer.send(OPT_TOGGLE, true)
      },
      'keydown',
    )
  }, [])
}

export default useOpt
