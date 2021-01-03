import { act, fireEvent, render, screen, within } from '@testing-library/react'
import electron from 'electron'
import React from 'react'

import Wrapper from '../_bootstrap'
import { CARROT_URL } from '../../../config/CONSTANTS'
import { INSTALLED_APPS_FOUND, URL_UPDATED } from '../../../main/events'
import { clickedTile, pressedAppKey } from '../../store/actions'

test('tiles', () => {
  render(<Wrapper />)
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
    // Includes affliate
    4,
  )

  // Set Safari as favourite
  fireEvent.click(screen.getByRole('button', { name: 'Settings menu' }))
  fireEvent.click(screen.getByRole('button', { name: 'Favourite Safari' }))
  fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
  const safariTile = screen.getByRole('button', { name: 'Safari Tile' })
  expect(within(safariTile).getByLabelText('Favourite')).toBeVisible()

  // Correct info sent to main when tile clicked
  fireEvent.click(screen.getByRole('button', { name: 'Firefox Tile' }))
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    'FROM_RENDERER',
    clickedTile({
      url: CARROT_URL,
      appId: 'org.mozilla.firefox',
      isAlt: false,
      isShift: false,
    }),
  )

  // Correct info sent to main when tile clicked
  const url = 'http://example.com'
  act(() => {
    win.webContents.send(URL_UPDATED, url)
  })
  fireEvent.click(screen.getByRole('button', { name: 'Brave Nightly Tile' }), {
    altKey: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    'FROM_RENDERER',
    clickedTile({
      url,
      appId: 'com.brave.Browser.nightly',
      isAlt: true,
      isShift: false,
    }),
  )
})

test('use hotkey', () => {
  render(<Wrapper />)
  const win = new electron.remote.BrowserWindow()
  act(() => {
    win.webContents.send(INSTALLED_APPS_FOUND, [
      { name: 'Safari', id: 'com.apple.Safari' },
    ])
  })
  // Set hotkeys
  fireEvent.click(screen.getByRole('button', { name: 'Settings menu' }))
  // Set Safari as s
  fireEvent.change(screen.getByLabelText('Safari hotkey'), {
    target: { value: 'S' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
  const url = 'http://example.com'
  act(() => {
    win.webContents.send(URL_UPDATED, url)
  })
  fireEvent.keyDown(document, { key: 'S', code: 'KeyS', keyCode: 83 })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    'FROM_RENDERER',
    pressedAppKey({
      url,
      appId: 'com.apple.Safari',
      isAlt: false,
      isShift: false,
    }),
  )
})

test('use hotkey with alt', () => {
  render(<Wrapper />)
  const win = new electron.remote.BrowserWindow()
  act(() => {
    win.webContents.send(INSTALLED_APPS_FOUND, [
      { name: 'Safari', id: 'com.apple.Safari' },
    ])
  })
  // Set hotkeys
  fireEvent.click(screen.getByRole('button', { name: 'Settings menu' }))
  // Set Safari as s
  fireEvent.change(screen.getByLabelText('Safari hotkey'), {
    target: { value: 's' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
  const url = 'http://example.com'
  act(() => {
    win.webContents.send(URL_UPDATED, url)
  })
  fireEvent.keyDown(document, {
    key: 's',
    code: 'KeyS',
    keyCode: 83,
    altKey: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    'FROM_RENDERER',
    pressedAppKey({
      url,
      appId: 'com.apple.Safari',
      isAlt: true,
      isShift: false,
    }),
  )
})

test('hold shift', () => {
  render(<Wrapper />)
  const win = new electron.remote.BrowserWindow()
  act(() => {
    win.webContents.send(INSTALLED_APPS_FOUND, [
      { name: 'Firefox', id: 'org.mozilla.firefox' },
    ])
  })
  const url = 'http://example.com'
  act(() => {
    win.webContents.send(URL_UPDATED, url)
  })
  fireEvent.click(screen.getByRole('button', { name: 'Firefox Tile' }), {
    shiftKey: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    'FROM_RENDERER',
    clickedTile({
      url,
      appId: 'org.mozilla.firefox',
      isAlt: false,
      isShift: true,
    }),
  )
})

test('tiles order', () => {
  render(<Wrapper />)
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

  // Includes affliate
  expect(tiles).toHaveLength(6)

  // Set hotkeys
  fireEvent.click(screen.getByRole('button', { name: 'Settings menu' }))
  // Set Safari as favourite
  fireEvent.click(screen.getByRole('button', { name: 'Favourite Safari' }))
  fireEvent.change(screen.getByLabelText('Opera hotkey'), {
    target: { value: '1' },
  })
  fireEvent.change(screen.getByLabelText('Brave hotkey'), {
    target: { value: '2' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))

  const updatedTiles = screen.getAllByRole('button', { name: /[A-z]+ Tile/u })
  expect(updatedTiles[0]).toHaveAttribute('aria-label', 'Safari Tile')
  // Affliate
  expect(updatedTiles[1]).toHaveAttribute('aria-label', 'Polypane Tile')
  expect(updatedTiles[2]).toHaveAttribute('aria-label', 'Opera Tile')
  expect(updatedTiles[3]).toHaveAttribute('aria-label', 'Brave Tile')
  expect(updatedTiles[4]).toHaveAttribute('aria-label', 'Firefox Tile')
  expect(updatedTiles[5]).toHaveAttribute('aria-label', 'Microsoft Edge Tile')
})

test.todo('affliate not shown when affliate is installed')
