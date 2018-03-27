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
    mousetrap.bind(this.props.activity.hotKey, () => this.hotKeyOpenActivity())
    this.setupDefault()
  }

  componentWillUnmount() {
    mousetrap.unbind(this.props.activity.hotKey)
  }

  componentDidUpdate() {
    this.setupDefault()
  }

  hotKeyOpenActivity = () => {
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
    if (this.props.defaultActivity) {
      mousetrap.unbind('enter')
      mousetrap.bind('enter', () => this.hotKeyOpenActivity())
    }
  }

  /**
   * Run Activity
   *
   * Tells the OS to open chosen activity with this.url.
   */
  runActivity = () => {
    spawn('sh', [
      '-c',
      this.props.activity.cmd.replace('{URL}', this.props.url)
    ])

    const currentWindow = remote.getCurrentWindow()
    currentWindow.hide()
  }

  render() {
    return (
      <Activity
        onClick={this.runActivity}
        activity={this.props.activity}
        active={this.state.active}
        defaultActivity={this.props.defaultActivity}
      />
    )
  }
}

export default ActivityContainer
