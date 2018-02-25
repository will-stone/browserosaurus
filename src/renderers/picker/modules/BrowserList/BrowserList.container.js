import { ipcRenderer, remote } from 'electron'
import React, { Component } from 'react'

import BrowserList from './BrowserList'

class BrowserListContainer extends Component {
  constructor() {
    super()

    this.state = {
      url: null
    }

    /**
     * Event: Receive browsers array from main
     *
     * @param {array} event
     * @param {array} url
     */
    ipcRenderer.on('incomingURL', (event, url) => this._onReceiveURL(url))
  }

  _onReceiveURL = url => {
    this.setState(
      {
        url
      },
      () => {
        const window = remote.getCurrentWindow()
        window.show()
      }
    )
  }

  render() {
    return <BrowserList url={this.state.url} />
  }
}

export default BrowserListContainer
