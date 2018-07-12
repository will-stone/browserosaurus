import { ipcRenderer } from 'electron'
import React from 'react'

import { ACTIVITIES_GET } from '../config/events'

class WithActivities extends React.Component {
  constructor() {
    super()

    this.state = {
      state: 'idle',
      activities: [],
    }

    /**
     * Event: Receive activities array from main
     *
     * @param {array} event
     * @param {array} activities
     */
    ipcRenderer.on('activities', (event, activities) =>
      this._onReceiveActivities(activities)
    )
  }

  /**
   * On Receive Activities
   *
   * Updates state
   * @param {array} activities
   */
  _onReceiveActivities(activities) {
    this.setState({ activities, state: 'fulfilled' })
  }

  handleRescan = () => {
    this.setState(
      {
        state: 'pending',
      },
      () => {
        ipcRenderer.send(ACTIVITIES_GET)
      }
    )
  }

  render() {
    return this.props.children(
      { activities: this.state.activities, state: this.state.state },
      this.handleRescan
    )
  }
}

export default WithActivities
