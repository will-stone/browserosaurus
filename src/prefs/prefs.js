import { FocusStyleManager, Tab, Tabs } from '@blueprintjs/core'
import React from 'react'
import ReactDOM from 'react-dom'
import Content from '../components/Content'
import TitleBar from '../components/TitleBar'
import Window from '../components/Window'
import WithActivities from '../utils/WithActivities'
import About from './components/Tab.About.container'
import Activities from './components/Tab.Activities.container'

FocusStyleManager.onlyShowFocusOnTabs()

ReactDOM.render(
  <WithActivities>
    {({ activities, state }, onRescan) => (
      <Window>
        <TitleBar>Preferences</TitleBar>

        <Content>
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
        </Content>
      </Window>
    )}
  </WithActivities>,
  document.getElementById('prefs-root')
)
