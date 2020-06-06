import { act, render, screen } from '@testing-library/react'
import electron from 'electron'
import React from 'react'

import { URL_UPDATED } from '../../main/events'
import TheApp from '../components/the-app'

// TODO: make sure url is split out into parts and host is bold
test('url bar', () => {
  render(<TheApp />)
  const win = new electron.remote.BrowserWindow()
  act(() => {
    win.webContents.send(URL_UPDATED, 'http://example.com')
  })
  expect(screen.getByText('example.com')).toBeVisible()
  expect(screen.queryByText('blah.com')).not.toBeInTheDocument()
})
