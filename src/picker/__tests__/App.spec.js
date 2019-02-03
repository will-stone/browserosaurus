import { remote } from 'electron'
import React from 'react'
import { render, wait, waitForElement } from 'react-testing-library'
import App from '../App'

const activities = [
  {
    appId: 'Firefox',
    cmd: 'open "{URL}" -a Firefox',
    hotKey: 'f',
    name: 'Firefox',
  },
  {
    cmd: 'echo "{URL}" | pbcopy',
    hotKey: 'space',
    name: 'Copy To Clipboard',
  },
]

describe('Picker App', () => {
  const props = {
    activities,
    isVisible: true,
    url: 'https://will-stone.github.io/browserosaurus/',
  }

  // it('renders the URL', () => {
  //   const { queryByText } = render(<App {...props} />)
  //   const url = queryByText(props.url)
  //   expect(url.innerHTML).toBe(props.url)
  // })

  // it('renders the loading spinner', async () => {
  //   const { container } = render(<App {...props} />)
  //   await waitForElement(() => container.querySelector('.bp3-spinner'))
  // })

  // it('renders the activities list', async () => {
  //   const { getAllByAltText } = render(<App {...props} />)
  //   const browserWindow = new remote.BrowserWindow()
  //   browserWindow.webContents.send('activities', activities)
  //   await wait(() => {
  //     const icons = getAllByAltText('activity')
  //     return expect(icons).toHaveLength(2)
  //   })
  // })
})
