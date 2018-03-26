import { remote } from 'electron'
import { spawn } from 'child_process'
import mousetrap from 'mousetrap'
import React, { Component } from 'react'

import Activity from './Activity'

class ActivityContainer extends Component {
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
          this.runActivity()
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
   * Run Activity
   *
   * Tells the OS to open chosen browser with this.url.
   */
  runActivity = () => {
    spawn('sh', ['-c', this.props.browser.cmd.replace('{URL}', this.props.url)])

    const currentWindow = remote.getCurrentWindow()
    currentWindow.hide()
  }

  render() {
    return (
      <Activity
        onClick={this.runActivity}
        browser={this.props.browser}
        active={this.state.active}
        defaultBrowser={this.props.defaultBrowser}
      />
    )
  }
}

export default ActivityContainer
