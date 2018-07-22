import { remote } from 'electron'
import React from 'react'
import { render, wait } from 'react-testing-library'
import ActivitiesTab from './activitiesTab.component'

const activities = [
  {
    appId: 'Firefox',
    cmd: 'open "{URL}" -a Firefox',
    enabled: true,
    hotKey: 'f',
    name: 'Firefox',
  },
  {
    cmd: 'echo "{URL}" | pbcopy',
    enabled: true,
    hotKey: 'space',
    name: 'Copy To Clipboard',
  },
]

describe('Preferences activities tab', () => {
  const props = {
    isVisible: true,
    url: 'https://will-stone.github.io/browserosaurus/',
  }

  it('renders the activities list', async () => {
    const { getAllByAltText } = render(<ActivitiesTab {...props} />)
    const browserWindow = new remote.BrowserWindow()
    browserWindow.webContents.send('activities', activities)
    await wait(() => {
      const icons = getAllByAltText('activity')
      return expect(icons).toHaveLength(2)
    })
  })
})
