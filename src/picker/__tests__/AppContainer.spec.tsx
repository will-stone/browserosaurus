import * as electron from 'electron'
import * as React from 'react'
import { render, fireEvent, wait } from 'react-testing-library'
import { ACTIVITIES_SET, URL_RECEIVED, ACTIVITY_RUN } from '../../config/events'
import { Activity } from '../../model'
import AppContainer from '../App.container'
import { copyToClipboard } from '../../utils/copyToClipboard'

jest.mock('../../utils/copyToClipboard')

const activities: Activity[] = [
  {
    appId: 'Firefox',
    cmd: 'open "{URL}" -a Firefox',
    hotKey: 'f',
    name: 'Firefox',
  },
]

describe('AppContainer', () => {
  it('renders the URL', () => {
    const { getByText } = render(<AppContainer />)

    // open window
    const win = new electron.remote.BrowserWindow()
    win.webContents.send(URL_RECEIVED, 'test url')

    getByText('test url')
  })

  it('renders the loading text', () => {
    const { getByText } = render(<AppContainer />)

    getByText('Loading...')
  })

  it('renders the activities', () => {
    const { getByAltText, getByText, queryByAltText } = render(<AppContainer />)

    expect(queryByAltText('Firefox')).not.toBeInTheDocument()

    // open window
    const win = new electron.remote.BrowserWindow()
    win.webContents.send(ACTIVITIES_SET, activities)
    win.webContents.send(URL_RECEIVED, 'test url')

    getByAltText('Firefox')
    getByText('f')
  })

  it('should close the window and run activity on activity click', async () => {
    const { getByAltText, queryByAltText, container } = render(<AppContainer />)

    expect(container.firstChild).not.toBeVisible()
    expect(queryByAltText('Firefox')).not.toBeInTheDocument()

    // open window
    const win = new electron.remote.BrowserWindow()
    win.webContents.send(ACTIVITIES_SET, activities)
    win.webContents.send(URL_RECEIVED, 'test url')

    // window shows
    await wait(() => expect(container.firstChild).toBeVisible())

    fireEvent.click(getByAltText('Firefox'))

    expect(electron.ipcRenderer.send).toBeCalledWith(ACTIVITY_RUN, {
      name: 'Firefox',
      url: 'test url',
    })

    // window hides
    await wait(() => expect(container.firstChild).not.toBeVisible())
  })

  it('should copy url and close the window on copy-to-clipboard click', async () => {
    const { getByText, container } = render(<AppContainer />)

    expect(container.firstChild).not.toBeVisible()

    const win = new electron.remote.BrowserWindow()
    win.webContents.send(ACTIVITIES_SET, activities)
    win.webContents.send(URL_RECEIVED, 'test url')

    // window shows
    await wait(() => expect(container.firstChild).toBeVisible())

    fireEvent.click(getByText('Copy To Clipboard'))

    expect(copyToClipboard).toHaveBeenCalledWith('test url')

    // window hides
    await wait(() => expect(container.firstChild).not.toBeVisible())
  })

  it('should close the window on background click', async () => {
    const { container } = render(<AppContainer />)

    expect(container.firstChild).not.toBeVisible()

    const win = new electron.remote.BrowserWindow()
    win.webContents.send(ACTIVITIES_SET, activities)
    win.webContents.send(URL_RECEIVED, 'test url')

    // window shows
    await wait(() => expect(container.firstChild).toBeVisible())

    fireEvent.click(container.firstChild as Element)

    // window hides
    await wait(() => expect(container.firstChild).not.toBeVisible())
  })
})
