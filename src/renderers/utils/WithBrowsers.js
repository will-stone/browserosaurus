import { ipcRenderer } from 'electron'
import React from 'react'

class WithBrowsers extends React.Component {
  constructor() {
    super()

    this.state = {
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
    this.setState({ browsers })
  }

  // componentDidMount() {
  //   ipcRenderer.send('get-browsers')
  // }

  render() {
    return this.props.children(this.state.browsers)
  }
}

export default WithBrowsers
