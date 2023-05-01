import type { AnyAction } from 'redux'

import type { Channel } from '../../shared/state/channels'

declare global {
  interface Window {
    electron: {
      send: (channel: Channel, action: AnyAction) => void
      receive: (
        mainChannel: Channel.MAIN,
        callback: (action: AnyAction) => void,
      ) => void
    }
  }

  interface Navigator {
    keyboard: {
      getLayoutMap: () => Promise<{ entries: () => Iterable<string> }>
    }
  }
}
