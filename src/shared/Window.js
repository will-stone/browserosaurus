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

  /**
   * Update Window Height
   *
   * public method
   * Sets the window height to current scroll height
   */
  updateWindowHeight() {
    const height = Math.min(
      document.body.scrollHeight,
      document.body.clientHeight
    )
    this.window.setSize(400, height)
    return false
  }
}

export default Window
