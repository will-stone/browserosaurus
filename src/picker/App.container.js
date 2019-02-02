import { spawn } from 'child_process'
import { ipcRenderer, remote, screen } from 'electron'
import mousetrap from 'mousetrap'
import React from 'react'
import { ACTIVITIES_UPDATED, PICKER_BLUR, URL_RECEIVED } from '../config/events'
import App from './App'

class AppContainer extends React.Component {
  constructor() {
    super()

    this.state = {
      isVisible: false,
      url: null,
      activities: [],
      state: 'idle',
    }

    ipcRenderer.on(URL_RECEIVED, this._handleReceiveURL)
    ipcRenderer.on(PICKER_BLUR, this._shrinkWindow)
    ipcRenderer.on(ACTIVITIES_UPDATED, this._handleReceiveActivities)
  }

  componentDidMount() {
    this._setupCommonHotkeys()
  }

  _setupCommonHotkeys = () => {
    mousetrap.bind('esc', this._shrinkWindow)
    mousetrap.bind('space', this.handleCopyToClipboard)
  }

  _setupHotkeys = activities =>
    activities.forEach(activity => {
      if (activity.favourite) {
        mousetrap.bind('enter', () => this.handleRunActivity(activity))
      }
      mousetrap.bind(activity.hotKey, () => this.handleRunActivity(activity))
    })

  _handleReceiveActivities = (_, activities) => {
    mousetrap.reset()
    this._setupCommonHotkeys()
    this._setupHotkeys(activities)
    this.setState({ activities, state: 'fulfilled' })
  }

  _handleReceiveURL = (_, url) => this.setState({ url }, this._showApp)

  _showApp = () => {
    const win = remote.getCurrentWindow()
    const { x: mouseX, y: mouseY } = screen.getCursorScreenPoint()
    win.setPosition(mouseX, mouseY, false)
    win.show()
    win.setIgnoreMouseEvents(false)
    this.setState({ isVisible: true })
  }

  _shrinkWindow = () => {
    remote.getCurrentWindow().setIgnoreMouseEvents(true) // allows click through during closing animation
    this.setState({ isVisible: false })
  }

  handleRunActivity = activity => {
    if (this.state.isVisible) {
      spawn('sh', ['-c', activity.cmd.replace('{URL}', this.state.url)])
      this._shrinkWindow()
    }
  }

  handleWindowAnimationEnd = () => {
    if (!this.state.isVisible) {
      remote.getCurrentWindow().hide()
    }
  }

  handleCopyToClipboard = () => {
    if (this.state.isVisible) {
      spawn('sh', ['-c', `echo "${this.state.url}" | pbcopy`])
      this._shrinkWindow()
    }
  }

  render() {
    return (
      <App
        activities={this.state.activities}
        isVisible={this.state.isVisible}
        onActivityClick={this.handleRunActivity}
        onCopyToClipboard={this.handleCopyToClipboard}
        onWindowAnimationEnd={this.handleWindowAnimationEnd}
        state={this.state.state}
        url={this.state.url}
      />
    )
  }
}

export default AppContainer
