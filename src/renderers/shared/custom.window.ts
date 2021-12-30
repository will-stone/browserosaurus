import type { AnyAction } from 'redux'

import type { Channel } from '../../shared/state/channels'

interface CustomNavigator extends Navigator {
  keyboard: {
    getLayoutMap: () => Promise<{ entries: () => Iterable<string> }>
  }
}

interface CustomWindow extends Window {
  electron: {
    send: (channel: Channel, action: AnyAction) => void
    receive: (
      mainChannel: Channel.MAIN,
      callback: (action: AnyAction) => void,
    ) => void
  }
  navigator: CustomNavigator
}

export const customWindow = window as unknown as CustomWindow
