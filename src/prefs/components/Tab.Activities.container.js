import { ipcRenderer } from 'electron'
import React, { Component } from 'react'
import { ACTIVITY_SORT, ACTIVITY_TOGGLE } from '../../config/events'
import TabActivities from './Tab.Activities'

class TabActivitiesContainer extends Component {
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

  /**
   * End Drag
   */
  handleDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    this._sortActivity(result.source.index, result.destination.index)
  }

  /**
   * Sort Activity
   *
   * Sends the ACTIVITY_SORT event to main.js. This allows activities to be
   * reordered.
   * @param {number} oldIndex index of activity being moved from.
   * @param {number} newIndex index of place activity is being moved to.
   */
  _sortActivity(oldIndex, newIndex) {
    ipcRenderer.send(ACTIVITY_SORT, { oldIndex, newIndex })
  }

  render() {
    const { activities, state, onRescan } = this.props
    return (
      <TabActivities
        activities={activities}
        state={state}
        onActivityToggle={this.handleActivityToggle}
        onDragEnd={this.handleDragEnd}
        onRescan={onRescan}
      />
    )
  }
}

export default TabActivitiesContainer
