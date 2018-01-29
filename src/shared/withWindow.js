import electron from 'electron'
import React from 'react'

function withWindow(WrappedComponent) {
  return class extends React.Component {
    constructor() {
      super()

      this.window = electron.remote.getCurrentWindow()

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
    updateWindowHeight = () => {
      const height = Math.min(
        document.body.scrollHeight,
        document.body.clientHeight
      )
      const width = this.window.getSize()[0]
      this.window.setSize(width, height)
      return false
    }

    render() {
      return (
        <WrappedComponent
          onReceiveBrowsers={this.onReceiveBrowsers}
          updateWindowHeight={this.updateWindowHeight}
        />
      )
    }
  }
}

export default withWindow
