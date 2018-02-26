import { Tabs, Tab } from '@blueprintjs/core'
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import TitleBar from '../components/TitleBar'

import WithBrowsers from '../utils/WithBrowsers'

import Browsers from './tabs/Browsers'
import About from './tabs/About'

// BluePrint
import { FocusStyleManager } from '@blueprintjs/core'
FocusStyleManager.onlyShowFocusOnTabs()

ReactDOM.render(
  <WithBrowsers>
    {({ browsers, state }, onRescan) => (
      <Fragment>
        <TitleBar>Preferences</TitleBar>

        <Tabs
          id="tabs"
          animate={true}
          renderActiveTabPanelOnly={true}
          large={true}
        >
          <Tabs.Expander />
          <Tab
            id="browsers"
            title="Browsers"
            panel={
              <Browsers browsers={browsers} state={state} onRescan={onRescan} />
            }
          />
          <Tabs.Expander />
          <Tab id="about" title="About" panel={<About />} />
          <Tabs.Expander />
        </Tabs>
      </Fragment>
    )}
  </WithBrowsers>,
  document.getElementById('prefs-root')
)
