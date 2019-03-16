import * as electron from 'electron'
import * as React from 'react'
import { render, fireEvent, wait, within, act } from 'react-testing-library'
import { ACTIVITIES_SET, URL_RECEIVED, ACTIVITY_RUN, FAV_SET } from '../../config/events'
import { Activity } from '../../model'
import App from '../App'
import { copyToClipboard } from '../../utils/copyToClipboard'

jest.mock('../../utils/copyToClipboard')

const activities: Activity[] = [
  {
    appId: 'Firefox',
    cmd: 'open "{URL}" -a Firefox',
    hotKey: 'f',
    name: 'Firefox',
  },
  {
    cmd: 'open "{URL}" -a Safari',
    hotKey: 's',
    name: 'Safari',
  },
]

describe('App', () => {
  it('should hide the window by default', () => {
    const { container } = render(<App />)
    expect(container.firstChild).not.toBeVisible()
  })

  it('should open the window when a URL is received', async () => {
    const { container } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(URL_RECEIVED, 'test url')
    })
    await wait(() => expect(container.firstChild).toBeVisible())
  })

  it('should display the loading text before activities received', () => {
    const { getByText } = render(<App />)
    getByText('Loading...')
  })

  it('should display the received URL', () => {
    const { getByText } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(URL_RECEIVED, 'test url')
    })
    getByText('test url')
  })

  it('should display the received activities', () => {
    const { getByAltText, getByText, queryByAltText } = render(<App />)
    expect(queryByAltText('Firefox')).not.toBeInTheDocument()
    expect(queryByAltText('Safari')).not.toBeInTheDocument()
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(ACTIVITIES_SET, activities)
    })
    getByAltText('Firefox')
    getByText('f')
    getByAltText('Safari')
    getByText('s')
  })

  it('should run activity and close the window on activity click', async () => {
    const { getByAltText, container } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(ACTIVITIES_SET, activities)
      win.webContents.send(URL_RECEIVED, 'test url')
    })
    // window shows
    await wait(() => expect(container.firstChild).toBeVisible())
    act(() => {
      fireEvent.click(getByAltText('Firefox'))
    })
    expect(electron.ipcRenderer.send).toBeCalledWith(ACTIVITY_RUN, {
      name: 'Firefox',
      url: 'test url',
    })
    // window hides
    await wait(() => expect(container.firstChild).not.toBeVisible())
  })

  it('should copy url and close the window on copy-to-clipboard click', async () => {
    const { getByText, container } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(URL_RECEIVED, 'test url')
    })
    // window shows
    await wait(() => expect(container.firstChild).toBeVisible())
    act(() => {
      fireEvent.click(getByText('Copy To Clipboard'))
    })
    expect(copyToClipboard).toHaveBeenCalledWith('test url')
    // window hides
    await wait(() => expect(container.firstChild).not.toBeVisible())
  })

  it('should close the window on background click', async () => {
    const { container } = render(<App />)
    expect(container.firstChild).not.toBeVisible()
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(URL_RECEIVED, 'test url')
    })
    // window shows
    await wait(() => expect(container.firstChild).toBeVisible())
    act(() => {
      fireEvent.click(container.firstChild as Element)
    })
    // window hides
    await wait(() => expect(container.firstChild).not.toBeVisible())
  })

  it('should set browser as favourite', async () => {
    const { queryAllByRole, container } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(ACTIVITIES_SET, activities)
      win.webContents.send(URL_RECEIVED, 'test url')
    })
    await wait(() => expect(container.firstChild).toBeVisible())
    // Check current order
    within(queryAllByRole('button')[0]).getByAltText('Firefox')
    within(queryAllByRole('button')[1]).getByAltText('Safari')
    act(() => {
      win.webContents.send(FAV_SET, 'Safari')
    })
    const acts = queryAllByRole('button')
    // Fav is now first:
    within(acts[0]).getByAltText('Safari')
    within(acts[1]).getByAltText('Firefox')
    // Fav is bigger:
    expect(acts[0]).toHaveStyle('height: 200px')
    expect(acts[0]).toHaveStyle('width: 200px')
    expect(acts[1]).toHaveStyle('height: 150px')
    expect(acts[1]).toHaveStyle('width: 150px')
  })
})
