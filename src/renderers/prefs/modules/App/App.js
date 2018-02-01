import React, { Fragment } from 'react'

import About from './About'
import Browsers from './Browsers'
import NavBar from './NavBar'
import Tab from './Tab'
import TitleBar from './TitleBar'

const App = ({ activeTabId, browsers, onTabButtonClick, onBrowserToggle }) => {
  return (
    <Fragment>
      <TitleBar>Preferences</TitleBar>
      <NavBar
        onTabButtonClick={onTabButtonClick}
        activeTabId={activeTabId}
      />
      <Tab
        active={activeTabId === 0}
        component={Browsers}
        browsers={browsers}
        onBrowserToggle={onBrowserToggle}
      />
      <Tab active={activeTabId === 1} component={About} />
    </Fragment>
  )
}

export default App
