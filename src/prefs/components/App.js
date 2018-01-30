import { ipcRenderer } from 'electron'
import React, { Fragment } from 'react'

import TitleBar from './TitleBar'
import NavBar from './NavBar'
import Tab from './Tab'

import BrowsersTable from '../tabs/BrowsersTable'
import About from '../tabs/About'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      activeTabId: 0
    }
  }

  componentDidMount() {
    ipcRenderer.send('get-browsers')
  }

  handleTabButtonClick = id => {
    this.setState({
      activeTabId: id
    })
  }

  render() {
    const { activeTabId } = this.state

    return (
      <Fragment>
        <TitleBar>Preferences</TitleBar>
        <NavBar
          onTabButtonClick={this.handleTabButtonClick}
          activeTabId={this.state.activeTabId}
        />
        <Tab active={activeTabId === 0} component={BrowsersTable} />
        <Tab active={activeTabId === 1} component={About} />
      </Fragment>
    )
  }
}

export default App
