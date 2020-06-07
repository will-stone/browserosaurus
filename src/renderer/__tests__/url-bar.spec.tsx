import { act, render, screen } from '@testing-library/react'
import electron from 'electron'
import React from 'react'

import { URL_UPDATED } from '../../main/events'
import TheApp from '../components/the-app'

const multiElementText = (text: string) => (_: string, node: HTMLElement) => {
  const hasText = (n: HTMLElement) => Boolean(n.textContent?.startsWith(text))
  const nodeHasText = hasText(node)
  const childrenDontHaveText = [
    ...((node.children as unknown) as HTMLElement[]),
  ].every((child) => !hasText(child))

  return nodeHasText && childrenDontHaveText
}

// TODO: make sure url is split out into parts and host is bold
test('url bar', () => {
  render(<TheApp />)
  const win = new electron.remote.BrowserWindow()
  const url = 'http://example.com'
  act(() => {
    win.webContents.send(URL_UPDATED, url)
  })
  expect(screen.getByText(multiElementText(url))).toBeVisible()
  expect(screen.queryByText('https://blah.com')).not.toBeInTheDocument()
})
