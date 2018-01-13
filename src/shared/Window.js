import electron from 'electron'

class Window {
  constructor() {
    this.window = electron.remote.getCurrentWindow()
    this.browserList = document.getElementById('browserList')

    /**
     * Event: Update browsers
     */
    electron.ipcRenderer.on('incomingBrowsers', (event, browsers) =>
      this.onReceiveBrowsers(browsers)
    )
  }

  onReceiveBrowsers() {
    return false
  }
}

export default Window
