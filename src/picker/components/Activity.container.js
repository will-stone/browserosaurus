import { remote } from 'electron'
import { spawn } from 'child_process'
import mousetrap from 'mousetrap'
import React, { Component } from 'react'

import Activity from './Activity'

class ActivityContainer extends Component {
  state = {
    active: false // used for styling when selecting an activity with a hot-key
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
        this.runActivity()
      }, 200)
    })
  }

  /**
   * Setup default activity hot-key
   *
   * The default activity is the one at the top and always opens by hitting the
   * enter key.
   */
  setupDefault = () => {
    if (this.props.defaultActivity) {
      mousetrap.unbind('enter')
      mousetrap.bind('enter', () => this.hotKeyOpenActivity())
    }
  }

  /**
   * Run Activity
   *
   * Tells the OS to open chosen activity with this.props.url.
   */
  runActivity = () => {
    spawn('sh', [
      '-c',
      this.props.activity.cmd.replace('{URL}', this.props.url)
    ])

    this.setState(
      {
        active: false
      },
      () => {
        setTimeout(() => {
          // TODO: timeout is hack to stop flash of "is-active" style on repopen.
          // This probably won't be needed if we implement a fade-in/out effect
          // for the window.
          const currentWindow = remote.getCurrentWindow()
          currentWindow.hide()
        }, 100)
      }
    )
  }

  handleMouseEnter = () => {
    this.setState({ active: true })
  }

  handleMouseLeave = () => {
    this.setState({ active: false })
  }

  render() {
    return (
      <Activity
        active={this.state.active}
        activity={this.props.activity}
        defaultActivity={this.props.defaultActivity}
        onClick={this.runActivity}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      />
    )
  }
}

export default ActivityContainer
