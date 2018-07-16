import { ipcRenderer, remote, screen } from 'electron'
import mousetrap from 'mousetrap'
import React from 'react'
import { PICKER_BLUR, URL_RECEIVED } from '../../config/events'
import App from './app.component'

class AppContainer extends React.Component {
  constructor() {
    super()

    this.state = {
      isVisible: false,
      url: null,
    }

    /**
     * Event: Receive URL from main
     *
     * @param {array} event
     * @param {array} url
     */
    ipcRenderer.on(URL_RECEIVED, (_, url) => this.handleReceiveURL(url))

    /**
     * Event: Click outside picker window closes it
     */
    ipcRenderer.on(PICKER_BLUR, () => this.hideApp())
  }

  componentDidMount() {
    // Escape to hide
    mousetrap.bind('esc', () => {
      this.hideApp()
    })
  }

  showApp = () => {
    const win = remote.getCurrentWindow()
    const { x: mouseX, y: mouseY } = screen.getCursorScreenPoint()
    win.setPosition(mouseX, mouseY, false)
    win.show()
    win.setIgnoreMouseEvents(false)
    this.setState({ isVisible: true })
  }

  hideApp = () => {
    remote.getCurrentWindow().setIgnoreMouseEvents(true) // allows click through during closing animation
    this.setState({ isVisible: false })
  }

  handleReceiveURL = url => {
    this.setState({ url }, this.showApp)
  }

  handleActivityClick = () => {
    this.hideApp()
  }

  handleSpringRest = () => {
    if (!this.state.isVisible) {
      remote.getCurrentWindow().hide()
    }
  }

  render() {
    const { isVisible, url } = this.state

    return (
      <App
        isVisible={isVisible}
        onActivityClick={this.handleActivityClick}
        onSpringRest={this.handleSpringRest}
        url={url}
      />
    )
  }
}

export default AppContainer
