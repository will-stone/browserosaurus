import * as electron from 'electron'
import * as React from 'react'
import { act, fireEvent, render } from 'react-testing-library'
import {
  ACTIVITIES_SET,
  ACTIVITY_RUN,
  URL_RECEIVED,
  FAV_SET,
} from '../../config/events'
import { Activity } from '../../model'
import App from '../App'

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
  // it('should display the loading text before activities received', () => {
  //   const { getByText } = render(<App />)
  //   getByText('Loading...')
  // })

  it('should display the received URL', () => {
    const { container, getByText } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(URL_RECEIVED, 'test url')
      fireEvent.mouseEnter(container.firstChild as Element)
    })
    getByText('test url')
  })

  // it('should display the received activities', () => {
  //   const {
  //     container,
  //     getByAltText,
  //     getByText,
  //     queryByAltText,
  //     queryByText,
  //   } = render(<App />)
  //   expect(queryByAltText('Firefox')).not.toBeInTheDocument()
  //   expect(queryByAltText('Safari')).not.toBeInTheDocument()
  //   const win = new electron.remote.BrowserWindow()
  //   act(() => {
  //     win.webContents.send(ACTIVITIES_SET, activities)
  //     fireEvent.mouseEnter(container.firstChild as Element)
  //   })
  //   getByAltText('Firefox')
  //   getByText('f')
  //   getByAltText('Safari')
  //   getByText('s')

  //   expect(queryByText('Loading...')).toBeFalsy()
  // })

  it('should run favourite activity on activity click', () => {
    const { getByAltText, container } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(ACTIVITIES_SET, activities)
      win.webContents.send(FAV_SET, 'Firefox')
      win.webContents.send(URL_RECEIVED, 'test url')
      fireEvent.mouseEnter(container.firstChild as Element)
    })
    act(() => {
      fireEvent.click(getByAltText('Firefox'))
    })
    expect(electron.ipcRenderer.send).toBeCalledWith(ACTIVITY_RUN, 'Firefox')
  })

  // it('should copy url on copy-to-clipboard click', () => {
  //   const { getByText } = render(<App />)
  //   const win = new electron.remote.BrowserWindow()
  //   act(() => {
  //     win.webContents.send(URL_RECEIVED, 'test url')
  //   })
  //   act(() => {
  //     fireEvent.click(getByText('Copy To Clipboard'))
  //   })
  //   expect(electron.ipcRenderer.send).toHaveBeenCalledWith(COPY_TO_CLIPBOARD)
  // })

  it('should CLOSE_WINDOW on background click', () => {
    const { container } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(URL_RECEIVED, 'test url')
      fireEvent.click(container.firstChild as Element)
    })
    expect(electron.ipcRenderer.send).toHaveBeenCalledWith('CLOSE_WINDOW')
  })

  // it('should set browser as favourite', () => {
  //   const { queryAllByRole } = render(<App />)
  //   const win = new electron.remote.BrowserWindow()
  //   act(() => {
  //     win.webContents.send(ACTIVITIES_SET, activities)
  //     win.webContents.send(URL_RECEIVED, 'test url')
  //   })
  //   // Check current order
  //   within(queryAllByRole('button')[0]).getByAltText('Firefox')
  //   within(queryAllByRole('button')[1]).getByAltText('Safari')
  //   act(() => {
  //     win.webContents.send(FAV_SET, 'Safari')
  //   })
  //   const acts = queryAllByRole('button')
  //   // Fav is now first:
  //   within(acts[0]).getByAltText('Safari')
  //   within(acts[1]).getByAltText('Firefox')
  //   // Fav is bigger:
  //   expect(acts[0]).toHaveStyle('height: 200px')
  //   expect(acts[0]).toHaveStyle('width: 200px')
  //   expect(acts[1]).toHaveStyle('height: 150px')
  //   expect(acts[1]).toHaveStyle('width: 150px')
  // })
})
