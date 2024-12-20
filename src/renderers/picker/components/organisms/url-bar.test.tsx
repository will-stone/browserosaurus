import '../../../shared/preload'

import { render, screen } from '@testing-library/react'
import electron from 'electron'

import { keyLayout } from '../../../../../__fixtures__/key-layout.js'
import { openedUrl } from '../../../../main/state/actions.js'
import { Channel } from '../../../../shared/state/channels.js'
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

test('url bar', async () => {
  render(<Wrapper />)
  const win = new electron.BrowserWindow()
  const protocol = 'http://'
  const host = 'example.com'
  const port = ':8000'
  const rest = '/foo?bar=moo'
  const url = `${protocol}${host}${port}${rest}`
  await win.webContents.send(Channel.MAIN, openedUrl(url))

  expect(screen.queryByText(protocol)).not.toBeInTheDocument()
  expect(screen.getByText(host + port)).toBeVisible()
  expect(screen.queryByText(rest)).not.toBeInTheDocument()
})
