import { remote } from 'electron'
import mousetrap from 'mousetrap'
import opn from 'opn'
import React, { Component } from 'react'

import Link from './Link'

class BrowserLinkContainer extends Component {
  state = {
    active: false
  }

  componentDidMount() {
    mousetrap.bind(this.props.browser.key, () => {
      this.setState({ active: true }, () => {
        setTimeout(() => {
          this.setState({
            active: false
          })
          setTimeout(() => {
            // extra timeout to prevent flash of ".is-active" on next open
            this.openBrowser(this.props.browser.name)
          }, 0)
        }, 200)
      })
    })
  }

  componentWillUnmount() {
    mousetrap.unbind(this.props.browser.key)
  }

  /**
   * Open Browser
   *
   * Tells the OS to open chosen browser with this.url.
   * @param {string} appName name of browser as recognised by macOS
   */
  openBrowser = appName => {
    const currentWindow = remote.getCurrentWindow()
    opn(this.props.url, { app: appName, wait: false })
      .then(() => currentWindow.hide())
      .catch(() => {
        alert(
          `Oh no! An error just occurred, please report this as a GitHub issue. Opened URL was ${
            this.props.url
          }`
        )
        currentWindow.hide()
      })
  }

  render() {
    return (
      <Link
        onClick={this.openBrowser}
        browser={this.props.browser}
        active={this.state.active}
      />
    )
  }
}

export default BrowserLinkContainer
