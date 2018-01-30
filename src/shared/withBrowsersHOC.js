import { ipcRenderer } from 'electron'
import React from 'react'

function withBrowsersHOC(WrappedComponent) {
  return class extends React.Component {
    constructor() {
      super()

      this.state = {
        browsers: null
      }

      /**
       * Event: Receive browsers array from main
       *
       * @param {array} browsers
       */
      ipcRenderer.on('browsers', (event, browsers) =>
        this.onReceiveBrowsers(browsers)
      )
    }

    onReceiveBrowsers(browsers) {
      this.setState({ browsers })
    }

    render() {
      return <WrappedComponent browsers={this.state.browsers} />
    }
  }
}

export default withBrowsersHOC
