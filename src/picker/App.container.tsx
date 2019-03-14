import { ipcRenderer, remote } from 'electron'
import * as mousetrap from 'mousetrap'
import * as React from 'react'
import { ACTIVITIES_SET, ACTIVITY_RUN, PICKER_BLUR, URL_RECEIVED, FAV_SET } from '../config/events'
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

    ipcRenderer.on(URL_RECEIVED, this.handleReceiveURL)
    ipcRenderer.on(PICKER_BLUR, this.shrinkWindow)
    ipcRenderer.on(ACTIVITIES_SET, this.handleReceiveActivities)
    ipcRenderer.on(FAV_SET, this.handleReceiveFav)
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
      mousetrap.bind(activity.hotKey, () => this.handleRunActivity(activity.name))
    })

  public setupFavHotkey = (fav: string) =>
    mousetrap.bind('enter', () => this.handleRunActivity(fav))

  public handleReceiveActivities = (_: unknown, activities: Activity[]) => {
    mousetrap.reset()
    this.setupCommonHotkeys()
    this.setupHotkeys(activities)
    this.state.fav && this.setupFavHotkey(this.state.fav)
    this.setState({ activities, state: EAppState.FULFILLED })
  }

  public handleReceiveFav = (_: unknown, fav: string) =>
    this.setState({ fav }, () => this.setupFavHotkey(fav))

  public handleReceiveURL = (_: unknown, url: string) => this.setState({ url, isVisible: true })

  public shrinkWindow = () => {
    remote.getCurrentWindow().setIgnoreMouseEvents(true) // allows click through during closing animation
    this.setState({ isVisible: false })
  }

  public handleRunActivity = (activityName: string) => {
    if (this.state.isVisible && this.state.url) {
      ipcRenderer.send(ACTIVITY_RUN, { name: activityName, url: this.state.url })
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
