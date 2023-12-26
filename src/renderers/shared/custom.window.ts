/* eslint-disable @typescript-eslint/consistent-type-definitions -- declaration merging required to patch globals */
import type { UnknownAction } from 'redux'

import type { Channel } from '../../shared/state/channels.js'

declare global {
  interface Window {
    electron: {
      send: (channel: Channel, action: UnknownAction) => void
      receive: (
        mainChannel: Channel.MAIN,
        callback: (action: UnknownAction) => void,
      ) => void
    }
  }

  interface Navigator {
    keyboard: {
      getLayoutMap: () => Promise<{ entries: () => Iterable<string> }>
    }
  }
}
