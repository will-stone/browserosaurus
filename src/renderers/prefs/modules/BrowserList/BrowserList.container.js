import { ipcRenderer } from 'electron'
import React, { Component } from 'react'

import { ACTIVITY_SORT, ACTIVITY_TOGGLE } from '../../../../config/events'

import BrowserList from './BrowserList'

class BrowserListContainer extends Component {
  /**
   * Toggle browser
   *
   * Sends the ACTIVITY_TOGGLE event to main.js. This enable/disables the
   * browser.
   * @param {string} browserName
   * @param {boolean} enabled
   */
  handleBrowserToggle(browserName, enabled) {
    ipcRenderer.send(ACTIVITY_TOGGLE, { browserName, enabled })
  }

  /**
   * End Drag
   */
  handleDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    this._sortBrowser(result.source.index, result.destination.index)
  }

  /**
   * Sort Browser
   *
   * Sends the ACTIVITY_SORT event to main.js. This allows browsers to be
   * reordered.
   * @param {number} oldIndex index of browser being moved from.
   * @param {number} newIndex index of place browser is being moved to.
   */
  _sortBrowser(oldIndex, newIndex) {
    ipcRenderer.send(ACTIVITY_SORT, { oldIndex, newIndex })
  }

  render() {
    return (
      <BrowserList
        {...this.props}
        onBrowserToggle={this.handleBrowserToggle}
        onDragEnd={this.handleDragEnd}
      />
    )
  }
}

export default BrowserListContainer
