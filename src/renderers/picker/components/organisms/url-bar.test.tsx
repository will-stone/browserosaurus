import '../../../shared/preload'

import { render, screen } from '@testing-library/react'
import electron from 'electron'

import { keyLayout } from '../../../../../__fixtures__/key-layout'
import { openedUrl } from '../../../../main/state/actions'
import { Channel } from '../../../../shared/state/channels'
import Wrapper from '../_bootstrap'

beforeAll(() => {
  global.window ??= Object.create(window)

  Object.defineProperty(window.navigator, 'keyboard', {
    value: {
      getLayoutMap: jest
        .fn()
        .mockResolvedValue({ entries: jest.fn().mockReturnValue(keyLayout) }),
    },
    writable: true,
  })
})

test('url bar', () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  const protocol = 'http://'
  const host = 'example.com'
  const port = ':8000'
  const rest = '/foo?bar=moo'
  const url = `${protocol}${host}${port}${rest}`
  win.webContents.send(Channel.MAIN, openedUrl(url))
  expect(screen.queryByText(protocol)).not.toBeInTheDocument()
  expect(screen.getByText(host + port)).toBeVisible()
  expect(screen.queryByText(rest)).not.toBeInTheDocument()
})
