import '../../../shared/preload'

import { fireEvent, render, screen } from '@testing-library/react'
import electron from 'electron'
import cloneDeep from 'lodash/cloneDeep'
import React from 'react'

import { keyLayout } from '../../../../../__fixtures__/key-layout'
import {
  installedAppsRetrieved,
  openedUrl,
  syncReducers,
} from '../../../../main/state/actions'
import { Channel } from '../../../../shared/state/channels'
import { defaultData } from '../../../../shared/state/reducer.data'
import { addChannelToAction } from '../../../../shared/utils/add-channel-to-action'
import { reorderedApp } from '../../../prefs/state/actions'
import { customWindow } from '../../../shared/custom.window'
import { clickedApp, pressedKey } from '../../state/actions'
import Wrapper from '../_bootstrap'

const originalNavigator = cloneDeep(customWindow.navigator)

beforeAll(() => {
  customWindow.navigator = {
    ...customWindow.navigator,
    keyboard: {
      getLayoutMap: jest
        .fn()
        .mockResolvedValue({ entries: jest.fn().mockReturnValue(keyLayout) }),
    },
  }
})

afterAll(() => {
  customWindow.navigator = originalNavigator
})

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
    syncReducers({
      storage: {
        apps: [
          { id: 'org.mozilla.firefox', hotCode: null },
          { id: 'com.apple.Safari', hotCode: null },
          { id: 'com.brave.Browser.nightly', hotCode: null },
        ],
        supportMessage: -1,
        height: 200,
        isSetup: true,
      },
      data: {
        ...defaultData,
        installedApps: [
          'com.brave.Browser.nightly',
          'org.mozilla.firefox',
          'com.apple.Safari',
        ],
      },
    }),
  )

  // Correct info sent to main when app clicked
  fireEvent.click(screen.getByRole('button', { name: 'Firefox App' }))
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    addChannelToAction(
      clickedApp({
        url: '',
        appId: 'org.mozilla.firefox',
        isAlt: false,
        isShift: false,
      }),
      Channel.PICKER,
    ),
  )

  // Correct info sent to main when app clicked
  const url = 'http://example.com'
  win.webContents.send(Channel.MAIN, openedUrl(url))
  fireEvent.click(screen.getByRole('button', { name: 'Brave Nightly App' }), {
    altKey: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    addChannelToAction(
      clickedApp({
        url,
        appId: 'com.brave.Browser.nightly',
        isAlt: true,
        isShift: false,
      }),
      Channel.PICKER,
    ),
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
    syncReducers({
      storage: {
        apps: [{ id: 'com.apple.Safari', hotCode: 'KeyS' }],
        supportMessage: -1,
        height: 200,
        isSetup: true,
      },
      data: defaultData,
    }),
  )

  const url = 'http://example.com'
  win.webContents.send(Channel.MAIN, openedUrl(url))
  fireEvent.keyDown(document, { key: 'S', code: 'KeyS', keyCode: 83 })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    addChannelToAction(
      pressedKey({
        virtualKey: 's',
        physicalKey: 'KeyS',
        altKey: false,
        shiftKey: false,
        metaKey: false,
      }),
      Channel.PICKER,
    ),
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
    syncReducers({
      storage: {
        apps: [{ id: 'com.apple.Safari', hotCode: 'KeyS' }],
        supportMessage: -1,
        height: 200,
        isSetup: true,
      },
      data: defaultData,
    }),
  )

  const url = 'http://example.com'
  win.webContents.send(Channel.MAIN, openedUrl(url))
  fireEvent.keyDown(document, {
    key: 's',
    code: 'KeyS',
    keyCode: 83,
    altKey: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    addChannelToAction(
      pressedKey({
        virtualKey: 's',
        physicalKey: 'KeyS',
        altKey: true,
        shiftKey: false,
        metaKey: false,
      }),
      Channel.PICKER,
    ),
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
  win.webContents.send(Channel.MAIN, openedUrl(url))
  fireEvent.click(screen.getByRole('button', { name: 'Firefox App' }), {
    shiftKey: true,
  })
  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    addChannelToAction(
      clickedApp({
        url,
        appId: 'org.mozilla.firefox',
        isAlt: false,
        isShift: true,
      }),
      Channel.PICKER,
    ),
  )
})

test('tiles order', () => {
  render(<Wrapper />)

  const win = new electron.BrowserWindow()

  win.webContents.send(
    Channel.MAIN,
    syncReducers({
      storage: {
        apps: [],
        supportMessage: -1,
        height: 200,
        isSetup: true,
      },
      data: defaultData,
    }),
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
    reorderedApp({
      sourceId: 'com.apple.Safari',
      destinationId: 'org.mozilla.firefox',
    }),
  )
  win.webContents.send(
    Channel.MAIN,
    reorderedApp({
      sourceId: 'com.operasoftware.Opera',
      destinationId: 'org.mozilla.firefox',
    }),
  )
  win.webContents.send(
    Channel.MAIN,
    reorderedApp({
      sourceId: 'com.brave.Browser',
      destinationId: 'org.mozilla.firefox',
    }),
  )

  const updatedApps = screen.getAllByRole('button', { name: /[A-z]+ App/u })

  expect(updatedApps[0]).toHaveAttribute('aria-label', 'Safari App')
  expect(updatedApps[1]).toHaveAttribute('aria-label', 'Opera App')
  expect(updatedApps[2]).toHaveAttribute('aria-label', 'Brave App')
  expect(updatedApps[3]).toHaveAttribute('aria-label', 'Firefox App')
  expect(updatedApps[4]).toHaveAttribute('aria-label', 'Edge App')
})
