import { ipcRenderer } from 'electron'
import React from 'react'

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
     * @param {} _ - not used
     * @param {array} activities
     */
    ipcRenderer.on('activities', (_, activities) => this._onReceiveActivities(activities))
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners('activities')
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

  render() {
    return this.props.children({ activities: this.state.activities, state: this.state.state })
  }
}

export default WithActivities
