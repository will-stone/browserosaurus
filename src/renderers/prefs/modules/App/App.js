import React, { Fragment } from 'react'

import { About, Browsers } from '../../components/tabs'
import NavBar from '../../components/NavBar'
import Tab from '../../components/Tab'
import TitleBar from '../../components/TitleBar'

const App = ({ activeTabId, browsers, onTabButtonClick, onBrowserToggle }) => {
  return (
    <Fragment>
      <TitleBar>Preferences</TitleBar>
      <NavBar onTabButtonClick={onTabButtonClick} activeTabId={activeTabId} />
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
