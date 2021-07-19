import '../../../shared/preload'

import { act, MatcherFunction, render, screen } from '@testing-library/react'
import electron from 'electron'
import React from 'react'

import { urlOpened } from '../../../../shared/state/actions'
import { Channel } from '../../../../shared/state/channels'
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

test('url bar', () => {
  render(<Wrapper />)
  const win = new electron.remote.BrowserWindow()
  const protocol = 'http:'
  const host = 'example.com:8000'
  const rest = '/foo?bar=moo'
  const url = `${protocol}//${host}${rest}`
  act(() => {
    win.webContents.send(Channel.MAIN, urlOpened(url))
  })
  expect(screen.getByText(multiElementText(url))).toBeVisible()
  expect(screen.queryByText('https://blah.com')).not.toBeInTheDocument()

  const hostHighlightClass = 'text-opacity-100'
  expect(screen.getByText(protocol)).not.toHaveClass(hostHighlightClass)
  expect(screen.getByText(host)).toHaveClass(hostHighlightClass)
  expect(screen.getByText(rest)).not.toHaveClass(hostHighlightClass)
})
