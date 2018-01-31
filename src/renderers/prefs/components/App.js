import { ipcRenderer } from 'electron'
import React, { Fragment } from 'react'

import About from './About'
import Browsers from './Browsers'
import NavBar from './NavBar'
import Tab from './Tab'
import TitleBar from './TitleBar'

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
  toggleBrowser(browserName, enabled) {
    ipcRenderer.send('toggle-browser', { browserName, enabled })
  }

  render() {
    const { activeTabId } = this.state
    const { browsers } = this.props

    return (
      <Fragment>
        <TitleBar>Preferences</TitleBar>
        <NavBar
          onTabButtonClick={this.handleTabButtonClick}
          activeTabId={this.state.activeTabId}
        />
        <Tab
          active={activeTabId === 0}
          component={Browsers}
          browsers={browsers}
          toggleBrowser={this.toggleBrowser}
        />
        <Tab active={activeTabId === 1} component={About} />
      </Fragment>
    )
  }
}

export default withBrowsersHOC(App)
