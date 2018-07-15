import { FocusStyleManager, Tab, Tabs } from '@blueprintjs/core'
import React from 'react'
import ReactDOM from 'react-dom'
import Content from '../components/Content'
import TitleBar from '../components/TitleBar'
import Window from '../components/Window'
import About from './components/Tab.About.container'
import Activities from './components/Tab.Activities'

FocusStyleManager.onlyShowFocusOnTabs()

ReactDOM.render(
  <Window>
    <TitleBar>Preferences</TitleBar>

    <Content>
      <Tabs id="tabs" animate={true} large={true}>
        <Tabs.Expander />

        <Tab id="activities" title="Activities" panel={<Activities />} />

        <Tabs.Expander />

        <Tab id="about" title="About" panel={<About />} />

        <Tabs.Expander />
      </Tabs>
    </Content>
  </Window>,
  document.getElementById('prefs-root')
)
