import { contextBridge, ipcRenderer } from 'electron'
import type { UnknownAction } from 'redux'

import { Channel } from '../../shared/state/channels.js'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  receive: (
    channel: Channel.MAIN,
    function_: (...arguments_: unknown[]) => void,
  ) => {
    const validChannels = [Channel.MAIN]

    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...arguments_) =>
        function_(...arguments_),
      )
    }
  },
  send: (channel: Channel, action: UnknownAction) => {
    const validChannels = [Channel.PREFS, Channel.PICKER]

    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, action)
    }
  },
})
