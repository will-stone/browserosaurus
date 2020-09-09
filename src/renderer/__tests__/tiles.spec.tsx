import { act, fireEvent, render, screen, within } from '@testing-library/react'
import electron from 'electron'
import React from 'react'

import { DEFAULT_URL } from '../../config/CONSTANTS'
import { INSTALLED_APPS_FOUND, URL_UPDATED } from '../../main/events'
import App from '../components/app'
import { APP_SELECTED } from '../sendToMain'

test('tiles', () => {
  render(<App />)
  const win = new electron.remote.BrowserWindow()
  act(() => {
    win.webContents.send(INSTALLED_APPS_FOUND, [
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
  expect(screen.queryByLabelText('Favourite')).not.toBeInTheDocument()

  // Set Safari as favourite
  fireEvent.click(screen.getByRole('button', { name: 'Settings menu' }))
  fireEvent.click(screen.getByRole('button', { name: 'Favourite Safari' }))
  fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
  const safariTile = screen.getByRole('button', { name: 'Safari Tile' })
  expect(within(safariTile).getByLabelText('Favourite')).toBeVisible()

  // Correct info sent to main when tile clicked
  fireEvent.click(screen.getByRole('button', { name: 'Firefox Tile' }))
  expect(electron.ipcRenderer.send).toHaveBeenLastCalledWith(APP_SELECTED, {
    url: DEFAULT_URL,
    appId: 'org.mozilla.firefox',
    isAlt: false,
  })

  act(() => {
    win.webContents.send(URL_UPDATED, 'http://example.com')
  })
  fireEvent.click(screen.getByAltText('Firefox'))
  expect(electron.ipcRenderer.send).toHaveBeenLastCalledWith(APP_SELECTED, {
    url: 'http://example.com',
    appId: 'org.mozilla.firefox',
    isAlt: false,
  })
})
