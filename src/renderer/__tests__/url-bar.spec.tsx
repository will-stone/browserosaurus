import { act, render, screen } from '@testing-library/react'
import electron from 'electron'
import React from 'react'

import { URL_HISTORY_CHANGED } from '../../main/events'
import TheApp from '../components/the-app'

// TODO: make sure url is split out into parts and host is bold
test('url bar', () => {
  render(<TheApp />)
  const win = new electron.remote.BrowserWindow()
  const urlItem = { id: 'abc', url: 'http://example.com', timestamp: 100 }
  act(() => {
    win.webContents.send(URL_HISTORY_CHANGED, [urlItem])
  })
  expect(screen.getByText('example.com')).toBeVisible()
  expect(screen.queryByText('blah.com')).not.toBeInTheDocument()
})
