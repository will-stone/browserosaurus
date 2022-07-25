import '../../../shared/preload'

import { act, render, screen } from '@testing-library/react'
import electron from 'electron'
import cloneDeep from 'lodash/cloneDeep'

import { keyLayout } from '../../../../../__fixtures__/key-layout'
import { openedUrl } from '../../../../main/state/actions'
import { Channel } from '../../../../shared/state/channels'
import { customWindow } from '../../../shared/custom.window'
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

test('url bar', () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  const protocol = 'http://'
  const host = 'example.com'
  const port = ':8000'
  const rest = '/foo?bar=moo'
  const url = `${protocol}${host}${port}${rest}`
  act(() => {
    win.webContents.send(Channel.MAIN, openedUrl(url))
  })
  expect(screen.queryByText(protocol)).not.toBeInTheDocument()
  expect(screen.getByText(host + port)).toBeVisible()
  expect(screen.queryByText(rest)).not.toBeInTheDocument()
})
