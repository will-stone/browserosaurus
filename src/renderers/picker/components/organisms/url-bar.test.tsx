import '../../../shared/preload'

import type { MatcherFunction } from '@testing-library/react'
import { act, render, screen } from '@testing-library/react'
import electron from 'electron'
import cloneDeep from 'lodash/cloneDeep'
import React from 'react'

import { keyLayout } from '../../../../../__fixtures__/key-layout'
import { openedUrl } from '../../../../main/state/actions'
import { Channel } from '../../../../shared/state/channels'
import { customWindow } from '../../../shared/custom.window'
import Wrapper from '../_bootstrap'

const multiElementText =
  (text: string): MatcherFunction =>
  (_, node) => {
    const nodeHasText = node?.textContent === text

    const childrenDontHaveText = [
      ...(node?.children as unknown as HTMLElement[]),
    ].every((child) => child?.textContent !== text)

    return nodeHasText && childrenDontHaveText
  }

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
  const rest = ':8000/foo?bar=moo'
  const url = `${protocol}${host}${rest}`
  act(() => {
    win.webContents.send(Channel.MAIN, openedUrl(url))
  })
  expect(screen.getByText(multiElementText(url))).toBeVisible()
  expect(screen.queryByText('https://blah.com')).not.toBeInTheDocument()

  const hostHighlightClass = 'text-opacity-100'
  expect(screen.getByText(protocol)).not.toHaveClass(hostHighlightClass)
  expect(screen.getByText(host)).toHaveClass(hostHighlightClass)
  expect(screen.getByText(rest)).not.toHaveClass(hostHighlightClass)
})
