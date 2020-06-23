import { act, fireEvent, render, screen, within } from '@testing-library/react'
import electron from 'electron'
import React from 'react'

import { BROWSERS_SCANNED, URL_UPDATED } from '../../main/events'
import TheApp from '../components/the-app'
import { SELECT_BROWSER } from '../sendToMain'

test('browsers', () => {
  render(<TheApp />)
  const win = new electron.remote.BrowserWindow()
  act(() => {
    win.webContents.send(BROWSERS_SCANNED, [
      { name: 'Firefox', id: 'org.mozilla.firefox' },
      { name: 'Safari', id: 'com.apple.Safari' },
    ])
  })
  // Check tiles and tile logos shown
  expect(screen.getByAltText('Firefox')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Firefox Tile' })).toBeVisible()
  expect(screen.getByAltText('Safari')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Safari Tile' })).toBeVisible()

  // Make sure no tile set as favourite
  expect(screen.queryByText('space')).not.toBeInTheDocument()

  // Set Safari as favourite
  fireEvent.click(screen.getByRole('button', { name: 'Tiles Menu' }))
  fireEvent.click(screen.getByRole('button', { name: 'Favourite Safari' }))
  fireEvent.click(screen.getByRole('button', { name: 'Tiles Menu' }))
  const safariTile = screen.getByRole('button', { name: 'Safari Tile' })
  expect(within(safariTile).getByText('space')).toBeVisible()

  // Correct info sent to main when tile clicked
  fireEvent.click(screen.getByAltText('Firefox'))
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(SELECT_BROWSER, {
    urlId: undefined,
    browserId: 'org.mozilla.firefox',
    isAlt: false,
  })

  act(() => {
    win.webContents.send(URL_UPDATED, 'http://example.com')
  })
  fireEvent.click(screen.getByAltText('Firefox'))
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(SELECT_BROWSER, {
    url: 'http://example.com',
    browserId: 'org.mozilla.firefox',
    isAlt: false,
  })
})
