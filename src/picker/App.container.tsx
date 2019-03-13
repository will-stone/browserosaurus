import { ipcRenderer, remote } from 'electron'
import * as mousetrap from 'mousetrap'
import * as React from 'react'
import { ACTIVITIES_UPDATED, PICKER_BLUR, URL_RECEIVED } from '../config/events'
import { Activity, EAppState } from '../model'
import { copyToClipboard } from '../utils/copyToClipboard'
import App from './App'

class AppContainer extends React.Component<
  {},
  {
    activities: Activity[]
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

  public setupHotkeys = (activities: Activity[]) =>
    activities.forEach(activity => {
      if (activity.fav) {
        mousetrap.bind('enter', () => this.handleRunActivity(activity))
      }
      mousetrap.bind(activity.hotKey, () => this.handleRunActivity(activity))
    })

  public handleReceiveActivities = (_: unknown, activities: Activity[]) => {
    mousetrap.reset()
    this.setupCommonHotkeys()
    this.setupHotkeys(activities)
    this.setState({ activities, state: EAppState.FULFILLED })
  }

  public handleReceiveURL = (_: unknown, url: string) => this.setState({ url, isVisible: true })

  public shrinkWindow = () => {
    remote.getCurrentWindow().setIgnoreMouseEvents(true) // allows click through during closing animation
    this.setState({ isVisible: false })
  }

  public handleRunActivity = (activity: Activity) => {
    if (this.state.isVisible && this.state.url) {
      ipcRenderer.send('run-act', { name: activity.name, url: this.state.url })
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
        onWindowClick={this.shrinkWindow}
        onWindowAnimationEnd={this.handleWindowAnimationEnd}
        state={this.state.state}
        url={this.state.url}
      />
    )
  }
}

export default AppContainer
