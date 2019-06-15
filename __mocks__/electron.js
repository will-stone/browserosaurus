// eslint-disable-next-line @typescript-eslint/no-var-requires
const EventEmitter = require('events')
const eventEmitter = new EventEmitter()

module.exports = {
  app: jest.fn(),
  dialog: jest.fn(),
  ipcRenderer: {
    on: jest.fn((name, fn) =>
      eventEmitter.on(name, payload => fn(null, payload)),
    ),
    removeAllListeners: jest.fn(channel =>
      eventEmitter.removeAllListeners(channel),
    ),
    send: jest.fn(),
  },
  match: jest.fn(),
  remote: {
    BrowserWindow: function() {
      return {
        webContents: {
          send: jest.fn((eventName, payload) =>
            eventEmitter.emit(eventName, payload),
          ),
        },
      }
    },
    getCurrentWindow: function() {
      return {
        setIgnoreMouseEvents: jest.fn(),
      }
    },
  },
  require: jest.fn(),
}
