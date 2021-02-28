import { act, render, screen } from '@testing-library/react'
import electron from 'electron'
import React from 'react'

import { URL_UPDATED } from '../../../main/events'
import Wrapper from '../_bootstrap'

const multiElementText = (text: string) => (_: string, node: HTMLElement) => {
  const hasText = (n: HTMLElement) => Boolean(n.textContent?.startsWith(text))
  const nodeHasText = hasText(node)
  const childrenDontHaveText = [
    ...((node.children as unknown) as HTMLElement[]),
  ].every((child) => !hasText(child))

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
    win.webContents.send(URL_UPDATED, url)
  })
  expect(screen.getByText(multiElementText(url))).toBeVisible()
  expect(screen.queryByText('https://blah.com')).not.toBeInTheDocument()

  const hostHighlightClass = 'text-opacity-100'
  expect(screen.getByText(protocol)).not.toHaveClass(hostHighlightClass)
  expect(screen.getByText(host)).toHaveClass(hostHighlightClass)
  expect(screen.getByText(rest)).not.toHaveClass(hostHighlightClass)
})

test.todo('Set as default browser')
