const EventTarget = require('events')
const { act } = require('@testing-library/react')

const eventEmitter = new EventTarget()

let clipboard

module.exports = {
  BrowserWindow: function () {
    return {
      webContents: {
        send: jest.fn((eventName, payload) =>
          act(() => {
            eventEmitter.emit(eventName, {
              ...payload,
              // web contents always sends an action from main
              meta: { ...payload.meta, channel: 'MAIN' },
            })
          }),
        ),
      },
    }
  },
  Notification: function () {
    return {
      show: jest.fn,
    }
  },
  app: jest.fn(),
  clipboard: {
    readText: () => clipboard,
    writeText: (string) => (clipboard = string),
  },
  contextBridge: {
    exposeInMainWorld: jest.fn((apiKey, { send, receive }) => {
      window[apiKey] = { receive, send }
    }),
  },
  dialog: jest.fn(),
  ipcRenderer: {
    on: jest.fn((eventName, function_) =>
      eventEmitter.on(eventName, (payload) => function_(undefined, payload)),
    ),
    removeAllListeners: jest.fn((channel) =>
      eventEmitter.removeAllListeners(channel),
    ),
    send: jest.fn(),
  },
  match: jest.fn(),
  remote: {
    getCurrentWindow() {
      return {
        setIgnoreMouseEvents: jest.fn(),
      }
    },
  },
  require: jest.fn(),
}
