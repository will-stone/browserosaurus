import { ipcRenderer } from 'electron'
import React from 'react'

import withBrowsersHOC from '../../shared/withBrowsersHOC'
import updateWindowHeight from '../../shared/updateWindowHeight'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      activeTabId: 0
    }
  }

  componentDidMount() {
    ipcRenderer.send('get-browsers')
    updateWindowHeight()
  }

  componentDidUpdate() {
    updateWindowHeight()
  }

  handleTabButtonClick = id => {
    this.setState({
      activeTabId: id
    })
  }

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

  render() {
    const { activeTabId } = this.state
    const { browsers } = this.props

    return (
      <App
        browsers={browsers}
        activeTabId={activeTabId}
        onTabButtonClick={this.handleTabButtonClick}
        onBrowserToggle={this.handleBrowserToggle}
      />
    )
  }
}

export default withBrowsersHOC(App)
