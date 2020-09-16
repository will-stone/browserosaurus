import { act, fireEvent, render, screen, within } from '@testing-library/react'
import electron from 'electron'
import React from 'react'

import { DEFAULT_URL } from '../../config/CONSTANTS'
import { INSTALLED_APPS_FOUND, URL_UPDATED } from '../../main/events'
import App from '../components/app'
import { APP_SELECTED, HIDE_WINDOW } from '../sendToMain'

test('tiles', () => {
  render(<App />)
  const win = new electron.remote.BrowserWindow()
  act(() => {
    win.webContents.send(INSTALLED_APPS_FOUND, [
      { name: 'Firefox', id: 'org.mozilla.firefox' },
      { name: 'Safari', id: 'com.apple.Safari' },
      { name: 'Brave Nightly', id: 'com.brave.Browser.nightly' },
    ])
  })
  // Check tiles and tile logos shown
  expect(screen.getByAltText('Firefox')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Firefox Tile' })).toBeVisible()
  expect(screen.getByAltText('Safari')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Safari Tile' })).toBeVisible()
  expect(screen.getByAltText('Brave Nightly')).toBeVisible()
  expect(
    screen.getByRole('button', { name: 'Brave Nightly Tile' }),
  ).toBeVisible()

  expect(screen.getAllByRole('button', { name: /[A-z]+ Tile/u })).toHaveLength(
    3,
  )

  // Set Safari as favourite
  fireEvent.click(screen.getByRole('button', { name: 'Settings menu' }))
  fireEvent.click(screen.getByRole('button', { name: 'Favourite Safari' }))
  fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
  const safariTile = screen.getByRole('button', { name: 'Safari Tile' })
  expect(within(safariTile).getByLabelText('Favourite')).toBeVisible()

  // Correct info sent to main when tile clicked
  fireEvent.click(screen.getByRole('button', { name: 'Firefox Tile' }))
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(APP_SELECTED, {
    url: DEFAULT_URL,
    appId: 'org.mozilla.firefox',
    isAlt: false,
  })
  expect(electron.ipcRenderer.send).toHaveBeenLastCalledWith(HIDE_WINDOW)

  // Correct info sent to main when tile clicked
  const url = 'http://example.com'
  act(() => {
    win.webContents.send(URL_UPDATED, url)
  })
  fireEvent.click(screen.getByRole('button', { name: 'Brave Nightly Tile' }), {
    altKey: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(APP_SELECTED, {
    url,
    appId: 'com.brave.Browser.nightly',
    isAlt: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenLastCalledWith(HIDE_WINDOW)
})

test('tiles order', () => {
  render(<App />)
  const win = new electron.remote.BrowserWindow()
  act(() => {
    win.webContents.send(INSTALLED_APPS_FOUND, [
      { name: 'Firefox', id: 'org.mozilla.firefox' },
      { name: 'Safari', id: 'com.apple.Safari' },
      { name: 'Opera', id: 'com.operasoftware.Opera' },
      { name: 'Microsoft Edge', id: 'com.microsoft.edgemac' },
      { name: 'Brave', id: 'com.brave.Browser' },
    ])
  })
  // Check tiles and tile logos shown
  const tiles = screen.getAllByRole('button', { name: /[A-z]+ Tile/u })

  expect(tiles).toHaveLength(5)

  // Set hotkeys
  fireEvent.click(screen.getByRole('button', { name: 'Settings menu' }))
  // Set Safari as favourite
  fireEvent.click(screen.getByRole('button', { name: 'Favourite Safari' }))
  fireEvent.change(screen.getByLabelText('Opera hotkey'), {
    target: { value: '1' },
  })
  fireEvent.change(screen.getByLabelText('Microsoft Edge hotkey'), {
    target: { value: '2' },
  })
  fireEvent.change(screen.getByLabelText('Brave hotkey'), {
    target: { value: '3' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))

  const updatedTiles = screen.getAllByRole('button', { name: /[A-z]+ Tile/u })
  expect(updatedTiles[0]).toHaveAttribute('aria-label', 'Safari Tile')
  expect(updatedTiles[1]).toHaveAttribute('aria-label', 'Opera Tile')
  expect(updatedTiles[2]).toHaveAttribute('aria-label', 'Microsoft Edge Tile')
  expect(updatedTiles[3]).toHaveAttribute('aria-label', 'Brave Tile')
  expect(updatedTiles[4]).toHaveAttribute('aria-label', 'Firefox Tile')
})
