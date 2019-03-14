import { ipcRenderer, remote } from 'electron'
import * as mousetrap from 'mousetrap'
import * as React from 'react'
import {
  ACTIVITIES_SET,
  ACTIVITY_RUN,
  FAV_SET,
  PICKER_BLUR,
  URL_RECEIVED,
  WINDOW_HIDE,
} from '../config/events'
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
    fav: string | null
  }
> {
  constructor(props: {}) {
    super(props)

    this.state = {
      activities: [],
      isVisible: false,
      state: EAppState.IDLE,
      url: null,
      fav: null,
    }

    ipcRenderer.on(URL_RECEIVED, this.onReceiveURL)
    ipcRenderer.on(PICKER_BLUR, this.shrinkWindow)
    ipcRenderer.on(ACTIVITIES_SET, this.onReceiveActivities)
    ipcRenderer.on(FAV_SET, this.onReceiveFav)
  }

  componentDidMount() {
    // setup common hotkeys
    mousetrap.bind('esc', this.shrinkWindow)
    mousetrap.bind('space', this.handleCopyToClipboard)
  }

  onReceiveActivities = (_: unknown, activities: Activity[]) => {
    // setup hotkeys
    activities.forEach(activity => {
      mousetrap.bind(activity.hotKey, () => this.handleRunActivity(activity.name))
    })
    this.setState({ activities, state: EAppState.FULFILLED })
  }

  onReceiveFav = (_: unknown, fav: string) =>
    this.setState({ fav }, () => mousetrap.bind('enter', () => this.handleRunActivity(fav)))

  onReceiveURL = (_: unknown, url: string) => this.setState({ url, isVisible: true })

  shrinkWindow = () => {
    remote.getCurrentWindow().setIgnoreMouseEvents(true) // allows click through during closing animation
    this.setState({ isVisible: false })
  }

  handleRunActivity = (activityName: string) => {
    if (this.state.isVisible && this.state.url) {
      ipcRenderer.send(ACTIVITY_RUN, { name: activityName, url: this.state.url })
      this.shrinkWindow()
    }
  }

  handleWindowAnimationEnd = () => !this.state.isVisible && ipcRenderer.send(WINDOW_HIDE)

  handleCopyToClipboard = () => {
    if (this.state.isVisible && this.state.url) {
      copyToClipboard(this.state.url)
      this.shrinkWindow()
    }
  }

  render() {
    return (
      <App
        fav={this.state.fav}
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
