import type { AnyAction } from 'redux'

import { Channel } from '../../shared/state/channels'

interface CustomWindow extends Window {
  electron: {
    send: (channel: Channel, action: AnyAction) => void
    receive: (
      mainChannel: Channel.MAIN,
      callback: (action: AnyAction) => void,
    ) => void
  }
}

export const customWindow = window as unknown as CustomWindow
