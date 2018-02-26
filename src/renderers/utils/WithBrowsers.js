import { ipcRenderer } from 'electron'
import React from 'react'

class WithBrowsers extends React.Component {
  constructor() {
    super()

    this.state = {
      state: 'fulfilled',
      browsers: null
    }

    /**
     * Event: Receive browsers array from main
     *
     * @param {array} event
     * @param {array} browsers
     */
    ipcRenderer.on('browsers', (event, browsers) =>
      this._onReceiveBrowsers(browsers)
    )
  }

  /**
   * On Receive Browsers
   *
   * Updates state
   * @param {array} browsers
   */
  _onReceiveBrowsers(browsers) {
    this.setState({ browsers, state: 'fulfilled' })
  }

  handleRescan = () => {
    this.setState(
      {
        state: 'pending'
      },
      () => {
        ipcRenderer.send('get-browsers')
      }
    )
  }

  render() {
    return this.props.children(
      { browsers: this.state.browsers, state: this.state.state },
      this.handleRescan
    )
  }
}

export default WithBrowsers
