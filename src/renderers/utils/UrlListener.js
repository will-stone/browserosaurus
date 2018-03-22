import { ipcRenderer, remote, screen } from 'electron'
import { Component } from 'react'

import { URL } from '../../config/events'

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
    ipcRenderer.on(URL, (event, url) => this._onReceiveURL(url))
  }

  _onReceiveURL = url => {
    this.setState(
      {
        url
      },
      () => {
        const win = remote.getCurrentWindow()
        const { x, y } = screen.getCursorScreenPoint()
        win.setPosition(x, y, false)
        win.show()
      }
    )
  }

  render() {
    return this.props.children(this.state.url)
  }
}

export default UrlListener
