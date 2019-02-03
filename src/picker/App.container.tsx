import { ipcRenderer, remote, screen } from 'electron'
import * as mousetrap from 'mousetrap'
import * as React from 'react'
import { ACTIVITIES_UPDATED, PICKER_BLUR, URL_RECEIVED } from '../config/events'
import { EAppState, IActivity } from '../model'
import { copyToClipboard } from '../utils/copyToClipboard'
import { runCommand } from '../utils/runCommand'
import App from './App'

class AppContainer extends React.Component<
  {},
  {
    activities: IActivity[]
    isVisible: boolean
    state: EAppState
    url: string | null
  }
> {
  constructor(props: {}) {
    super(props)

    this.state = {
      activities: [],
      isVisible: false,
      state: EAppState.IDLE,
      url: null,
    }

    ipcRenderer.on(URL_RECEIVED, this.handleReceiveURL)
    ipcRenderer.on(PICKER_BLUR, this.shrinkWindow)
    ipcRenderer.on(ACTIVITIES_UPDATED, this.handleReceiveActivities)
  }

  public componentDidMount() {
    this.setupCommonHotkeys()
  }

  public setupCommonHotkeys = () => {
    mousetrap.bind('esc', this.shrinkWindow)
    mousetrap.bind('space', this.handleCopyToClipboard)
  }

  public setupHotkeys = (activities: IActivity[]) =>
    activities.forEach(activity => {
      if (activity.favourite) {
        mousetrap.bind('enter', () => this.handleRunActivity(activity))
      }
      mousetrap.bind(activity.hotKey, () => this.handleRunActivity(activity))
    })

  public handleReceiveActivities = (_: unknown, activities: IActivity[]) => {
    mousetrap.reset()
    this.setupCommonHotkeys()
    this.setupHotkeys(activities)
    this.setState({ activities, state: EAppState.FULFILLED })
  }

  public handleReceiveURL = (_: unknown, url: string) => this.setState({ url }, this.showApp)

  public showApp = () => {
    const win = remote.getCurrentWindow()
    const { x: mouseX, y: mouseY } = screen.getCursorScreenPoint()
    win.setPosition(mouseX, mouseY, false)
    win.show()
    win.setIgnoreMouseEvents(false)
    this.setState({ isVisible: true })
  }

  public shrinkWindow = () => {
    remote.getCurrentWindow().setIgnoreMouseEvents(true) // allows click through during closing animation
    this.setState({ isVisible: false })
  }

  public handleRunActivity = (activity: IActivity) => {
    if (this.state.isVisible && this.state.url) {
      runCommand(activity.cmd.replace('{URL}', this.state.url))
      this.shrinkWindow()
    }
  }

  public handleWindowAnimationEnd = () => {
    if (!this.state.isVisible) {
      remote.getCurrentWindow().hide()
    }
  }

  public handleCopyToClipboard = () => {
    if (this.state.isVisible && this.state.url) {
      copyToClipboard(this.state.url)
      this.shrinkWindow()
    }
  }

  public render() {
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
