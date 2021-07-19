import '../../../shared/preload'

import { act, fireEvent, render, screen, within } from '@testing-library/react'
import electron from 'electron'
import React from 'react'

import {
  clickedTile,
  pressedAppKey,
  syncApps,
  syncStorage,
  urlOpened,
} from '../../../../shared/state/actions'
import { Channel } from '../../../../shared/state/channels'
import Wrapper from '../_bootstrap'

test('tiles', () => {
  render(<Wrapper />)
  const win = new electron.remote.BrowserWindow()
  act(() => {
    win.webContents.send(
      Channel.MAIN,
      syncApps([
        { name: 'Firefox', id: 'org.mozilla.firefox' },
        { name: 'Safari', id: 'com.apple.Safari' },
        { name: 'Brave Nightly', id: 'com.brave.Browser.nightly' },
      ]),
    )
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

  act(() => {
    win.webContents.send(
      Channel.MAIN,
      syncStorage({
        supportMessage: -1,
        fav: 'com.apple.Safari',
        hiddenTileIds: [],
        hotkeys: {},
        width: 200,
        height: 200,
        firstRun: false,
      }),
    )
  })

  // Set Safari as favourite
  const safariTile = screen.getByRole('button', { name: 'Safari Tile' })
  expect(within(safariTile).getByLabelText('Star')).toBeVisible()

  // Correct info sent to main when tile clicked
  fireEvent.click(screen.getByRole('button', { name: 'Firefox Tile' }))
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.TILES,
    clickedTile({
      url: '',
      appId: 'org.mozilla.firefox',
      isAlt: false,
      isShift: false,
    }),
  )

  // Correct info sent to main when tile clicked
  const url = 'http://example.com'
  act(() => {
    win.webContents.send(Channel.MAIN, urlOpened(url))
  })
  fireEvent.click(screen.getByRole('button', { name: 'Brave Nightly Tile' }), {
    altKey: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.TILES,
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
    win.webContents.send(
      Channel.MAIN,
      syncApps([{ name: 'Safari', id: 'com.apple.Safari' }]),
    )
  })
  act(() => {
    win.webContents.send(
      Channel.MAIN,
      syncStorage({
        supportMessage: -1,
        fav: 'com.apple.Safari',
        hiddenTileIds: [],
        hotkeys: { s: 'com.apple.Safari' },
        width: 200,
        height: 200,
        firstRun: false,
      }),
    )
  })

  const url = 'http://example.com'
  act(() => {
    win.webContents.send(Channel.MAIN, urlOpened(url))
  })
  fireEvent.keyDown(document, { key: 'S', code: 'KeyS', keyCode: 83 })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.TILES,
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
    win.webContents.send(
      Channel.MAIN,
      syncApps([{ name: 'Safari', id: 'com.apple.Safari' }]),
    )
  })

  act(() => {
    win.webContents.send(
      Channel.MAIN,
      syncStorage({
        supportMessage: -1,
        fav: 'com.apple.Safari',
        hiddenTileIds: [],
        hotkeys: { s: 'com.apple.Safari' },
        width: 200,
        height: 200,
        firstRun: false,
      }),
    )
  })

  const url = 'http://example.com'
  act(() => {
    win.webContents.send(Channel.MAIN, urlOpened(url))
  })
  fireEvent.keyDown(document, {
    key: 's',
    code: 'KeyS',
    keyCode: 83,
    altKey: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.TILES,
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
    win.webContents.send(
      Channel.MAIN,
      syncApps([{ name: 'Firefox', id: 'org.mozilla.firefox' }]),
    )
  })
  const url = 'http://example.com'
  act(() => {
    win.webContents.send(Channel.MAIN, urlOpened(url))
  })
  fireEvent.click(screen.getByRole('button', { name: 'Firefox Tile' }), {
    shiftKey: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.TILES,
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
    win.webContents.send(
      Channel.MAIN,
      syncApps([
        { name: 'Firefox', id: 'org.mozilla.firefox' },
        { name: 'Safari', id: 'com.apple.Safari' },
        { name: 'Opera', id: 'com.operasoftware.Opera' },
        { name: 'Microsoft Edge', id: 'com.microsoft.edgemac' },
        { name: 'Brave', id: 'com.brave.Browser' },
      ]),
    )
  })
  // Check tiles and tile logos shown
  const tiles = screen.getAllByRole('button', { name: /[A-z]+ Tile/u })

  expect(tiles).toHaveLength(5)

  act(() => {
    win.webContents.send(
      Channel.MAIN,
      syncStorage({
        supportMessage: -1,
        fav: 'com.apple.Safari',
        hiddenTileIds: [],
        hotkeys: { 1: 'com.operasoftware.Opera', 2: 'com.brave.Browser' },
        width: 200,
        height: 200,
        firstRun: false,
      }),
    )
  })

  const updatedTiles = screen.getAllByRole('button', { name: /[A-z]+ Tile/u })
  expect(updatedTiles[0]).toHaveAttribute('aria-label', 'Safari Tile')
  expect(updatedTiles[1]).toHaveAttribute('aria-label', 'Opera Tile')
  expect(updatedTiles[2]).toHaveAttribute('aria-label', 'Brave Tile')
  expect(updatedTiles[3]).toHaveAttribute('aria-label', 'Firefox Tile')
  expect(updatedTiles[4]).toHaveAttribute('aria-label', 'Microsoft Edge Tile')
})
