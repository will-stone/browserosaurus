import eventEmitter from '../src/utils/eventEmitter'

module.exports = {
  app: jest.fn(),
  dialog: jest.fn(),
  ipcRenderer: {
    on: (eventName, callback) => {
      eventEmitter.on(eventName, payload => {
        return callback(null, payload)
      })
    },
    removeAllListeners: eventName => {
      eventEmitter.removeAllListeners(eventName)
    },
  },
  match: jest.fn(),
  remote: {
    BrowserWindow: function() {
      return {
        webContents: {
          send: (eventName, payload) => {
            eventEmitter.emit(eventName, payload)
          },
        },
      }
    },
  },
  require: jest.fn(),
}
