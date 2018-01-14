import electron from 'electron'

class Window {
  constructor() {
    this.window = electron.remote.getCurrentWindow()
    this.browserList = document.getElementById('browserList')

    /**
     * Event: Receive browsers array from main
     *
     * @param {array} browsers
     */
    electron.ipcRenderer.on('incomingBrowsers', (event, browsers) =>
      this.onReceiveBrowsers(browsers)
    )
  }

  /**
   * On Receive Browsers
   *
   * public method
   */
  onReceiveBrowsers() {
    return false
  }
}

export default Window
