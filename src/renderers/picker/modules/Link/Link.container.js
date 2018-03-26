import { remote } from 'electron'
import { spawn } from 'child_process'
import mousetrap from 'mousetrap'
import React, { Component } from 'react'

import Link from './Link'

class BrowserLinkContainer extends Component {
  state = {
    active: false
  }

  componentDidMount() {
    mousetrap.bind(this.props.browser.hotKey, () => this.hotKeyOpenBrowser())
    this.setupDefault()
  }

  componentWillUnmount() {
    mousetrap.unbind(this.props.browser.hotKey)
  }

  componentDidUpdate() {
    this.setupDefault()
  }

  hotKeyOpenBrowser = () => {
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
  }

  setupDefault = () => {
    if (this.props.defaultBrowser) {
      mousetrap.unbind('enter')
      mousetrap.bind('enter', () => this.hotKeyOpenBrowser())
    }
  }

  /**
   * Open Browser
   *
   * Tells the OS to open chosen browser with this.url.
   * @param {string} appName name of browser as recognised by macOS
   */
  openBrowser = appName => {
    spawn('sh', ['-c', this.props.browser.cmd.replace('{URL}', this.props.url)])

    const currentWindow = remote.getCurrentWindow()
    currentWindow.hide()
  }

  render() {
    return (
      <Link
        onClick={this.openBrowser}
        browser={this.props.browser}
        active={this.state.active}
        defaultBrowser={this.props.defaultBrowser}
      />
    )
  }
}

export default BrowserLinkContainer
