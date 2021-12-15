import '../../../shared/preload'

import { fireEvent, render, screen } from '@testing-library/react'
import electron from 'electron'
import React from 'react'

import {
  clickedApp,
  installedAppsRetrieved,
  pressedAppKey,
  reorderedApps,
  syncStorage,
  urlOpened,
} from '../../../../shared/state/actions'
import { Channel } from '../../../../shared/state/channels'
import Wrapper from '../_bootstrap'

test('apps', () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  win.webContents.send(
    Channel.MAIN,
    installedAppsRetrieved([
      'org.mozilla.firefox',
      'com.apple.Safari',
      'com.brave.Browser.nightly',
    ]),
  )
  // Check apps and app logos shown
  expect(screen.getByText('Firefox')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Firefox App' })).toBeVisible()
  expect(screen.getByAltText('Safari')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Safari App' })).toBeVisible()
  expect(screen.getByAltText('Brave Nightly')).toBeVisible()
  expect(
    screen.getByRole('button', { name: 'Brave Nightly App' }),
  ).toBeVisible()

  expect(screen.getAllByRole('button', { name: /[A-z]+ App/u })).toHaveLength(3)

  win.webContents.send(
    Channel.MAIN,
    syncStorage({
      apps: [
        { id: 'org.mozilla.firefox', hotkey: null },
        { id: 'com.apple.Safari', hotkey: null },
        { id: 'com.brave.Browser.nightly', hotkey: null },
      ],
      supportMessage: -1,
      height: 200,
      firstRun: false,
    }),
  )

  // Correct info sent to main when app clicked
  fireEvent.click(screen.getByRole('button', { name: 'Firefox App' }))
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    clickedApp({
      url: '',
      appId: 'org.mozilla.firefox',
      isAlt: false,
      isShift: false,
    }),
  )

  // Correct info sent to main when app clicked
  const url = 'http://example.com'
  win.webContents.send(Channel.MAIN, urlOpened(url))
  fireEvent.click(screen.getByRole('button', { name: 'Brave Nightly App' }), {
    altKey: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    clickedApp({
      url,
      appId: 'com.brave.Browser.nightly',
      isAlt: true,
      isShift: false,
    }),
  )
})

test('use hotkey', () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  win.webContents.send(
    Channel.MAIN,
    installedAppsRetrieved(['com.apple.Safari']),
  )
  win.webContents.send(
    Channel.MAIN,
    syncStorage({
      apps: [{ id: 'com.apple.Safari', hotkey: 's' }],
      supportMessage: -1,
      height: 200,
      firstRun: false,
    }),
  )

  const url = 'http://example.com'
  win.webContents.send(Channel.MAIN, urlOpened(url))
  fireEvent.keyDown(document, { key: 'S', code: 'KeyS', keyCode: 83 })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
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
  const win = new electron.BrowserWindow()
  win.webContents.send(
    Channel.MAIN,
    installedAppsRetrieved(['com.apple.Safari']),
  )

  win.webContents.send(
    Channel.MAIN,
    syncStorage({
      apps: [{ id: 'com.apple.Safari', hotkey: 's' }],
      supportMessage: -1,
      height: 200,
      firstRun: false,
    }),
  )

  const url = 'http://example.com'
  win.webContents.send(Channel.MAIN, urlOpened(url))
  fireEvent.keyDown(document, {
    key: 's',
    code: 'KeyS',
    keyCode: 83,
    altKey: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
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
  const win = new electron.BrowserWindow()
  win.webContents.send(
    Channel.MAIN,
    installedAppsRetrieved(['org.mozilla.firefox']),
  )
  const url = 'http://example.com'
  win.webContents.send(Channel.MAIN, urlOpened(url))
  fireEvent.click(screen.getByRole('button', { name: 'Firefox App' }), {
    shiftKey: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    clickedApp({
      url,
      appId: 'org.mozilla.firefox',
      isAlt: false,
      isShift: true,
    }),
  )
})

test('tiles order', () => {
  render(<Wrapper />)

  const win = new electron.BrowserWindow()

  win.webContents.send(
    Channel.MAIN,
    syncStorage({ apps: [], supportMessage: -1, height: 200, firstRun: false }),
  )

  win.webContents.send(
    Channel.MAIN,
    installedAppsRetrieved([
      'org.mozilla.firefox',
      'com.apple.Safari',
      'com.operasoftware.Opera',
      'com.microsoft.edgemac',
      'com.brave.Browser',
    ]),
  )
  // Check tiles and tile logos shown
  const apps = screen.getAllByRole('button', { name: /[A-z]+ App/u })

  expect(apps).toHaveLength(5)

  win.webContents.send(
    Channel.MAIN,
    reorderedApps({
      sourceId: 'com.apple.Safari',
      destinationId: 'org.mozilla.firefox',
    }),
  )
  win.webContents.send(
    Channel.MAIN,
    reorderedApps({
      sourceId: 'com.operasoftware.Opera',
      destinationId: 'org.mozilla.firefox',
    }),
  )
  win.webContents.send(
    Channel.MAIN,
    reorderedApps({
      sourceId: 'com.brave.Browser',
      destinationId: 'org.mozilla.firefox',
    }),
  )

  const updatedApps = screen.getAllByRole('button', { name: /[A-z]+ App/u })

  expect(updatedApps[0]).toHaveAttribute('aria-label', 'Safari App')
  expect(updatedApps[1]).toHaveAttribute('aria-label', 'Opera App')
  expect(updatedApps[2]).toHaveAttribute('aria-label', 'Brave App')
  expect(updatedApps[3]).toHaveAttribute('aria-label', 'Firefox App')
  expect(updatedApps[4]).toHaveAttribute('aria-label', 'Microsoft Edge App')
})
