import { Tab, Tabs } from '@blueprintjs/core'
import React from 'react'
import Content from '../../components/Content'
import TitleBar from '../../components/TitleBar'
import Window from '../../components/Window'
import AboutTab from './aboutTab/aboutTab.container'
import ActivitiesTab from './actvitiesTab/activitiesTab.component'

const AppComponent = () => (
  <Window>
    <TitleBar>Preferences</TitleBar>

    <Content>
      <Tabs id="tabs" animate={true} large={true}>
        <Tabs.Expander />

        <Tab id="activities" title="Activities" panel={<ActivitiesTab />} />

        <Tabs.Expander />

        <Tab id="about" title="About" panel={<AboutTab />} />

        <Tabs.Expander />
      </Tabs>
    </Content>
  </Window>
)

export default AppComponent
