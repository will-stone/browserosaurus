import React, { Fragment } from 'react'

import TitleBar from './TitleBar'
import NavBar from './NavBar'
import Tab from './Tab'
import BrowsersTable from './BrowsersTable'
import About from './About'

import withWindow from '../../shared/withWindow'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      activeTabId: 0
    }
  }

  componentDidMount() {
    this.props.updateWindowHeight()
  }

  handleTabButtonClick = id => {
    this.setState(
      {
        activeTabId: id
      },
      () => this.props.updateWindowHeight()
    )
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

export default withWindow(App)
