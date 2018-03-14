import { ipcRenderer, remote } from 'electron'
import { Component } from 'react'
import opn from 'opn'

class UrlListener extends Component {
  constructor() {
    super()

    this.state = {
      url: null,
      lastClickDate: 0
    }

    /**
     * Event: Receive browsers array from main
     *
     * @param {array} event
     * @param {array} url
     */
    ipcRenderer.on('incomingURL', (event, url) => this._onReceiveURL(url))
  }

  _onReceiveURL(url){
    const isDblClick = ( this.state.url === url && ( new Date() - this.state.lastClickDate < 300 ) )

    this.setState(
      {
        url: isDblClick ? null : url,
        lastClickDate: isDblClick ? 0 : new Date()
      },
      () => {
        if( isDblClick ){
          opn(url, { app: this.props.defaultBrowser.name, wait: false })
        }else{
          const window = remote.getCurrentWindow()
          window.center()
          window.show()
        }
      }
    )

  }

  render() {
    return this.props.children(this.state.url)
  }
}

export default UrlListener
