import { ipcRenderer } from 'electron'
import React, { Component } from 'react'

import BrowserList from './BrowserList'

class BrowserListContainer extends Component {
  /**
   * Toggle browser
   *
   * Sends the toggle-browser event to main.js. This enable/disables the
   * browser.
   * @param {string} browserName
   * @param {boolean} enabled
   */
  handleBrowserToggle(browserName, enabled) {
    ipcRenderer.send('toggle-browser', { browserName, enabled })
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
   * Sends the sort-browser event to main.js. This allows browsers to be
   * reordered.
   * @param {number} oldIndex index of browser being moved from.
   * @param {number} newIndex index of place browser is being moved to.
   */
  _sortBrowser(oldIndex, newIndex) {
    ipcRenderer.send('sort-browser', { oldIndex, newIndex })
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
