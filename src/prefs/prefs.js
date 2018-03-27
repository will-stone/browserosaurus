import { Tabs, Tab } from '@blueprintjs/core'
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import TitleBar from '../components/TitleBar'

import WithActivities from '../utils/WithActivities'

import Activities from './components/Tab.Activities'
import About from './components/Tab.About'

// BluePrint
import { FocusStyleManager } from '@blueprintjs/core'
FocusStyleManager.onlyShowFocusOnTabs()

ReactDOM.render(
  <WithActivities>
    {({ activities, state }, onRescan) => (
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
            id="activities"
            title="Activities"
            panel={
              <Activities
                activities={activities}
                state={state}
                onRescan={onRescan}
              />
            }
          />
          <Tabs.Expander />
          <Tab id="about" title="About" panel={<About />} />
          <Tabs.Expander />
        </Tabs>
      </Fragment>
    )}
  </WithActivities>,
  document.getElementById('prefs-root')
)
