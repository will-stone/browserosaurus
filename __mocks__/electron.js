const EventEmitter = require('events')

const eventEmitter = new EventEmitter()

let clipboard

module.exports = {
  app: jest.fn(),
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
    BrowserWindow: function () {
      return {
        webContents: {
          send: jest.fn((eventName, payload) =>
            eventEmitter.emit(eventName, payload),
          ),
        },
      }
    },
    getCurrentWindow() {
      return {
        setIgnoreMouseEvents: jest.fn(),
      }
    },
  },
  require: jest.fn(),
  clipboard: {
    writeText: (string) => (clipboard = string),
    readText: () => clipboard,
  },
  contextBridge: {
    exposeInMainWorld: jest.fn((apiKey, { send, receive }) => {
      window[apiKey] = { send, receive }
    }),
  },
}
