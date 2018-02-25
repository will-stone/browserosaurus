import { ipcRenderer, remote } from 'electron'
import { Component } from 'react'

class UrlListener extends Component {
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
    return this.props.children(this.state.url)
  }
}

export default UrlListener
