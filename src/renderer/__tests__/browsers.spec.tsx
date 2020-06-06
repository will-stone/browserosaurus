import { act, fireEvent, render, screen } from '@testing-library/react'
import electron from 'electron'
import React from 'react'

import {
  BROWSERS_SCANNED,
  FAVOURITE_CHANGED,
  URL_UPDATED,
} from '../../main/events'
import TheApp from '../components/the-app'
import { BROWSER_SELECTED } from '../events'

test('browsers', () => {
  render(<TheApp />)
  const win = new electron.remote.BrowserWindow()
  act(() => {
    win.webContents.send(BROWSERS_SCANNED, [
      { name: 'Firefox', id: 'org.mozilla.firefox', logo: 'firefox' },
      { name: 'Safari', id: 'com.apple.Safari', logo: 'safari' },
    ])
  })
  expect(screen.getByAltText('Safari')).toBeVisible()
  expect(screen.getByText('Safari')).toBeVisible()
  expect(screen.getByAltText('Firefox')).toBeVisible()
  expect(screen.getByText('Firefox')).toBeVisible()

  expect(screen.queryByText('space')).not.toBeInTheDocument()
  act(() => {
    win.webContents.send(FAVOURITE_CHANGED, 'com.apple.Safari')
  })
  expect(screen.getByText('space')).toBeVisible()

  fireEvent.click(screen.getByAltText('Firefox'))
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(BROWSER_SELECTED, {
    urlId: undefined,
    browserId: 'org.mozilla.firefox',
    isAlt: false,
  })

  act(() => {
    win.webContents.send(URL_UPDATED, 'http://example.com')
  })
  fireEvent.click(screen.getByAltText('Firefox'))
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(BROWSER_SELECTED, {
    url: 'http://example.com',
    browserId: 'org.mozilla.firefox',
    isAlt: false,
  })
})
