module.exports = {
  app: jest.fn(),
  dialog: jest.fn(),
  ipcRenderer: {
    on: jest.fn(),
    removeAllListeners: jest.fn(),
  },
  match: jest.fn(),
  remote: {
    BrowserWindow: function() {
      return {
        webContents: {
          send: jest.fn((eventName, payload) => {
            return payload
          }),
        },
      }
    },
  },
  require: jest.fn(),
}
