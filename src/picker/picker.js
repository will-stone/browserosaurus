import { Spinner, Text } from '@blueprintjs/core'
import { ipcRenderer, remote, screen } from 'electron'
import { css } from 'emotion'
import mousetrap from 'mousetrap'
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { Spring } from 'react-spring'
import TitleBar from '../components/TitleBar'
import { PICKER_BLUR, URL_RECEIVED } from '../config/events'
import WindowHeightUpdater from '../utils/WindowHeightUpdater'
import WithActivities from '../utils/WithActivities'
import Activity from './components/Activity.container'

class Picker extends React.Component {
  constructor() {
    super()

    this.state = {
      isVisible: false,
      url: null,
    }

    /**
     * Event: Receive URL from main
     *
     * @param {array} event
     * @param {array} url
     */
    ipcRenderer.on(URL_RECEIVED, (_, url) => this.handleReceiveURL(url))

    /**
     * Event: Click outside picker window closes it
     */
    ipcRenderer.on(PICKER_BLUR, () => this.hideApp())
  }

  componentDidMount() {
    // Escape to hide
    mousetrap.bind('esc', () => {
      this.hideApp()
    })
  }

  showApp = () => {
    const win = remote.getCurrentWindow()
    const { x: mouseX, y: mouseY } = screen.getCursorScreenPoint()
    win.setPosition(mouseX, mouseY, false)
    win.show()
    win.setIgnoreMouseEvents(false)
    this.setState({ isVisible: true })
  }

  hideApp = () => {
    remote.getCurrentWindow().setIgnoreMouseEvents(true) // allows click through during closing animation
    this.setState({ isVisible: false })
  }

  handleReceiveURL = url => {
    this.setState({ url }, this.showApp)
  }

  handleActivityClick = () => {
    this.hideApp()
  }

  handleSpringRest = () => {
    if (!this.state.isVisible) {
      remote.getCurrentWindow().hide()
    }
  }

  render() {
    const { isVisible, url } = this.state

    return (
      <Spring
        to={{
          opacity: isVisible ? 1 : 0,
          transform: `scale(${isVisible ? 1 : 0})`,
          transformOrigin: '0 0',
        }}
        onRest={this.handleSpringRest}
      >
        {styles => (
          <div
            style={styles}
            className={css`
              background-color: #21252b;
            `}
          >
            <TitleBar>
              <Text ellipsize={true}>{url}</Text>
            </TitleBar>
            <WithActivities>
              {({ activities, state }) => {
                return state === 'idle' || state === 'pending' ? (
                  <div
                    style={{
                      textAlign: 'center',
                      paddingBottom: '1rem',
                    }}
                  >
                    <Spinner intent="primary" className="pt-small" />
                    <WindowHeightUpdater />
                  </div>
                ) : (
                  <Fragment>
                    <div>
                      {activities
                        .filter(activity => activity.enabled)
                        .map((activity, index) => (
                          <Activity
                            key={activity.name}
                            activity={activity}
                            defaultActivity={index === 0}
                            onClick={this.handleActivityClick}
                            isAppVisible={isVisible}
                            url={url}
                          />
                        ))}
                    </div>
                    <WindowHeightUpdater />
                  </Fragment>
                )
              }}
            </WithActivities>
          </div>
        )}
      </Spring>
    )
  }
}

ReactDOM.render(<Picker />, document.getElementById('picker-root'))
