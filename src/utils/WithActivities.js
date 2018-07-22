import arrayMove from 'array-move'
import { ipcRenderer } from 'electron'
import React from 'react'
import {
  ACTIVITIES_GET,
  ACTIVITY_SORT,
  ACTIVITY_TOGGLE,
} from '../config/events'

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
    ipcRenderer.on('activities', (_, activities) =>
      this._onReceiveActivities(activities)
    )
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

  /**
   * End Drag
   */
  handleDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const newActivities = arrayMove(
      this.state.activities,
      result.source.index,
      result.destination.index
    )

    this.setState({
      activities: newActivities,
    })

    ipcRenderer.send(ACTIVITY_SORT, {
      oldIndex: result.source.index,
      newIndex: result.destination.index,
    })
  }

  /**
   * Toggle activity
   *
   * Sends the ACTIVITY_TOGGLE event to main.js. This enable/disables the
   * activity.
   * @param {string} activityName
   * @param {boolean} enabled
   */
  handleActivityToggle(activityName, enabled) {
    ipcRenderer.send(ACTIVITY_TOGGLE, { activityName, enabled })
  }

  render() {
    return this.props.children(
      { activities: this.state.activities, state: this.state.state },
      {
        onRescan: this.handleRescan,
        onDragEnd: this.handleDragEnd,
        onActivityToggle: this.handleActivityToggle,
      }
    )
  }
}

export default WithActivities
