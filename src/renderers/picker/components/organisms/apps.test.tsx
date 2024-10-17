import '../../../shared/preload'

import { fireEvent, render, screen } from '@testing-library/react'
import electron from 'electron'

import { keyLayout } from '../../../../../__fixtures__/key-layout.js'
import {
  openedUrl,
  receivedRendererStartupSignal,
  retrievedInstalledApps,
} from '../../../../main/state/actions.js'
import { Channel } from '../../../../shared/state/channels.js'
import { defaultData } from '../../../../shared/state/reducer.data.js'
import { addChannelToAction } from '../../../../shared/utils/add-channel-to-action.js'
import { reorderedApp } from '../../../prefs/state/actions.js'
import { clickedApp, pressedKey } from '../../state/actions.js'
import Wrapper from '../_bootstrap.js'

beforeAll(() => {
  Object.defineProperty(globalThis.navigator, 'keyboard', {
    value: {
      getLayoutMap: jest
        .fn()
        .mockResolvedValue({ entries: jest.fn().mockReturnValue(keyLayout) }),
    },
    writable: true,
  })
})

test('kitchen sink', async () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  await win.webContents.send(
    Channel.MAIN,
    retrievedInstalledApps(['Firefox', 'Safari', 'Brave Browser']),
  )

  // Check apps and app logos shown
  expect(screen.getByTestId('Firefox')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Firefox App' })).toBeVisible()
  expect(screen.getByTestId('Safari')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Safari App' })).toBeVisible()
  expect(screen.getByTestId('Brave Browser')).toBeVisible()
  expect(
    screen.getByRole('button', { name: 'Brave Browser App' }),
  ).toBeVisible()

  expect(screen.getAllByRole('button', { name: /[A-z]+ App/u })).toHaveLength(3)

  await win.webContents.send(
    Channel.MAIN,
    receivedRendererStartupSignal({
      data: {
        ...defaultData,
      },
      storage: {
        apps: [
          {
            hotCode: null,
            isInstalled: true,
            name: 'Firefox',
          },
          {
            hotCode: null,
            isInstalled: true,
            name: 'Safari',
          },
          {
            hotCode: null,
            isInstalled: false,
            name: 'Opera',
          },
          {
            hotCode: null,
            isInstalled: true,
            name: 'Brave Browser',
          },
        ],
        height: 200,
        isSetup: true,
        supportMessage: -1,
      },
    }),
  )

  expect(
    screen.queryByRole('alert', { name: 'Loading browsers' }),
  ).not.toBeInTheDocument()

  // Correct info sent to main when app clicked
  fireEvent.click(screen.getByRole('button', { name: 'Firefox App' }))

  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    addChannelToAction(
      clickedApp({
        appName: 'Firefox',
        isAlt: false,
        isShift: false,
      }),
      Channel.PICKER,
    ),
  )

  // Correct info sent to main when app clicked
  const url = 'http://example.com'
  await win.webContents.send(Channel.MAIN, openedUrl(url))
  fireEvent.click(screen.getByRole('button', { name: 'Brave Browser App' }), {
    altKey: true,
  })

  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    addChannelToAction(
      clickedApp({
        appName: 'Brave Browser',
        isAlt: true,
        isShift: false,
      }),
      Channel.PICKER,
    ),
  )
})

test('should show spinner when no installed apps are found', async () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  await win.webContents.send(
    Channel.MAIN,
    receivedRendererStartupSignal({
      data: defaultData,
      storage: {
        apps: [
          {
            hotCode: 'KeyS',
            isInstalled: false,
            name: 'Safari',
          },
        ],
        height: 200,
        isSetup: true,
        supportMessage: -1,
      },
    }),
  )

  expect(screen.getByRole('alert', { name: 'Loading browsers' })).toBeVisible()
})

test('should use hotkey', async () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  await win.webContents.send(Channel.MAIN, retrievedInstalledApps(['Safari']))
  await win.webContents.send(
    Channel.MAIN,
    receivedRendererStartupSignal({
      data: defaultData,
      storage: {
        apps: [
          {
            hotCode: 'KeyS',
            isInstalled: true,
            name: 'Safari',
          },
        ],
        height: 200,
        isSetup: true,
        supportMessage: -1,
      },
    }),
  )

  const url = 'http://example.com'
  await win.webContents.send(Channel.MAIN, openedUrl(url))
  fireEvent.keyDown(document, { code: 'KeyS', key: 'S', keyCode: 83 })

  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    addChannelToAction(
      pressedKey({
        altKey: false,
        metaKey: false,
        physicalKey: 'KeyS',
        shiftKey: false,
        virtualKey: 's',
      }),
      Channel.PICKER,
    ),
  )
})

test('should use hotkey with alt', async () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  await win.webContents.send(Channel.MAIN, retrievedInstalledApps(['Safari']))

  await win.webContents.send(
    Channel.MAIN,
    receivedRendererStartupSignal({
      data: defaultData,
      storage: {
        apps: [
          {
            hotCode: 'KeyS',
            isInstalled: true,
            name: 'Safari',
          },
        ],
        height: 200,
        isSetup: true,
        supportMessage: -1,
      },
    }),
  )

  const url = 'http://example.com'
  await win.webContents.send(Channel.MAIN, openedUrl(url))
  fireEvent.keyDown(document, {
    altKey: true,
    code: 'KeyS',
    key: 's',
    keyCode: 83,
  })

  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    addChannelToAction(
      pressedKey({
        altKey: true,
        metaKey: false,
        physicalKey: 'KeyS',
        shiftKey: false,
        virtualKey: 's',
      }),
      Channel.PICKER,
    ),
  )
})

test('should hold shift', async () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  await win.webContents.send(Channel.MAIN, retrievedInstalledApps(['Firefox']))
  await win.webContents.send(Channel.MAIN, openedUrl('http://example.com'))
  fireEvent.click(screen.getByRole('button', { name: 'Firefox App' }), {
    shiftKey: true,
  })

  expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
    Channel.PICKER,
    addChannelToAction(
      clickedApp({
        appName: 'Firefox',
        isAlt: false,
        isShift: true,
      }),
      Channel.PICKER,
    ),
  )
})

test('should order tiles', async () => {
  render(<Wrapper />)

  const win = new electron.BrowserWindow()

  await win.webContents.send(
    Channel.MAIN,
    receivedRendererStartupSignal({
      data: defaultData,
      storage: {
        apps: [],
        height: 200,
        isSetup: true,
        supportMessage: -1,
      },
    }),
  )

  await win.webContents.send(
    Channel.MAIN,
    retrievedInstalledApps([
      'Firefox',
      'Safari',
      'Opera',
      'Microsoft Edge',
      'Brave Browser',
    ]),
  )
  // Check tiles and tile logos shown
  const apps = screen.getAllByRole('button', { name: /[A-z]+ App/u })

  expect(apps).toHaveLength(5)

  await win.webContents.send(
    Channel.MAIN,
    reorderedApp({
      destinationName: 'Firefox',
      sourceName: 'Safari',
    }),
  )
  await win.webContents.send(
    Channel.MAIN,
    reorderedApp({
      destinationName: 'Firefox',
      sourceName: 'Opera',
    }),
  )
  await win.webContents.send(
    Channel.MAIN,
    reorderedApp({
      destinationName: 'Firefox',
      sourceName: 'Brave Browser',
    }),
  )

  const updatedApps = screen.getAllByRole('button', { name: /[A-z]+ App/u })

  expect(updatedApps[0]).toHaveAttribute('aria-label', 'Safari App')
  expect(updatedApps[1]).toHaveAttribute('aria-label', 'Opera App')
  expect(updatedApps[2]).toHaveAttribute('aria-label', 'Brave Browser App')
  expect(updatedApps[3]).toHaveAttribute('aria-label', 'Firefox App')
  expect(updatedApps[4]).toHaveAttribute('aria-label', 'Microsoft Edge App')
})
