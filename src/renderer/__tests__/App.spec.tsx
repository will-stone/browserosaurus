import { act, fireEvent, render, wait, within } from '@testing-library/react'
import * as electron from 'electron'
import * as React from 'react'

import {
  browsers2,
  browsers4,
  browsers5,
  browsers7,
  browsers9,
} from '../__fixtures__/browsers'
import {
  BROWSER_RUN,
  BROWSERS_SET,
  CLOSE_WINDOW,
  COPY_TO_CLIPBOARD,
  FAV_SET,
  URL_RECEIVED,
} from '../../config/events'
import App from '../App'

jest.mock('../../utils/copyToClipboard')

describe('App', () => {
  // TODO: make sure url is split out into parts and host is bold
  it('should display the received URL', () => {
    const { container, getByText } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(URL_RECEIVED, 'example.com')
      fireEvent.mouseEnter(container.firstChild as Element)
    })
    expect(getByText('example.com')).toBeVisible()
  })

  it('should display the received browsers', () => {
    const { container, getByAltText, getByText } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(BROWSERS_SET, browsers2)
      fireEvent.mouseEnter(container.firstChild as Element)
    })
    expect(getByAltText('Safari')).toBeVisible()
    expect(getByText('s / space')).toBeVisible()
    expect(getByAltText('Firefox')).toBeVisible()
    expect(getByText('f')).toBeVisible()
  })

  it('should show picker window on mouse enter', () => {
    const { container, getByTestId } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(BROWSERS_SET, browsers2)
      fireEvent.mouseEnter(container.firstChild as Element)
    })
    expect(getByTestId('picker-window')).toBeVisible()
  })

  it('should run favourite browser on browser click', () => {
    const { getByAltText, container } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(BROWSERS_SET, browsers2)
      win.webContents.send(FAV_SET, 'Firefox')
      win.webContents.send(URL_RECEIVED, 'example.com')
      fireEvent.mouseEnter(container.firstChild as Element)
    })
    act(() => {
      fireEvent.click(getByAltText('Firefox'))
    })
    expect(electron.ipcRenderer.send).toHaveBeenCalledWith(
      BROWSER_RUN,
      'Firefox',
    )
  })

  it('should copy url on click', () => {
    const { getByText } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(URL_RECEIVED, 'example.com')
    })
    act(() => {
      fireEvent.click(getByText('example.com'))
    })
    expect(electron.ipcRenderer.send).toHaveBeenCalledWith(COPY_TO_CLIPBOARD)
  })

  it('should CLOSE_WINDOW on background click', async () => {
    const { container } = render(<App />)
    act(() => {
      fireEvent.click(container.firstChild as Element)
    })
    await wait(() =>
      expect(electron.ipcRenderer.send).toHaveBeenCalledWith(CLOSE_WINDOW),
    )
  })

  it('should set browser as favourite', () => {
    const { container, queryAllByTestId } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(FAV_SET, 'Safari')
      win.webContents.send(BROWSERS_SET, browsers2)
      win.webContents.send(URL_RECEIVED, 'example.com')
    })
    fireEvent.mouseEnter(container.firstChild as Element)

    // Check current order
    expect(
      within(queryAllByTestId('browser-button')[0]).getByAltText('Safari'),
    ).toBeInTheDocument()

    expect(
      within(queryAllByTestId('browser-button')[1]).getByAltText('Firefox'),
    ).toBeInTheDocument()

    act(() => {
      win.webContents.send(FAV_SET, 'Firefox')
    })

    // Fav is now first:
    expect(
      within(queryAllByTestId('browser-button')[0]).getByAltText('Firefox'),
    ).toBeInTheDocument()

    expect(
      within(queryAllByTestId('browser-button')[1]).getByAltText('Safari'),
    ).toBeInTheDocument()
  })

  describe('Picker Window', () => {
    it('should size correctly for 2 browsers', () => {
      const { getByTestId } = render(<App />)
      const win = new electron.remote.BrowserWindow()
      act(() => {
        win.webContents.send(BROWSERS_SET, browsers2)
      })
      expect(getByTestId('picker-window')).toHaveStyle(`
          width: 200px;
          height: 150px;
        `)
    })

    it('should size correctly for 4 browsers', () => {
      const { getByTestId } = render(<App />)
      const win = new electron.remote.BrowserWindow()
      act(() => {
        win.webContents.send(BROWSERS_SET, browsers4)
      })
      expect(getByTestId('picker-window')).toHaveStyle(`
          width: 400px;
          height: 150px;
        `)
    })

    it('should size correctly for 5 browsers', () => {
      const { getByTestId } = render(<App />)
      const win = new electron.remote.BrowserWindow()
      act(() => {
        win.webContents.send(BROWSERS_SET, browsers5)
      })
      expect(getByTestId('picker-window')).toHaveStyle(`
          width: 300px;
          height: 250px;
        `)
    })

    it('should size correctly for 7 browsers', () => {
      const { getByTestId } = render(<App />)
      const win = new electron.remote.BrowserWindow()
      act(() => {
        win.webContents.send(BROWSERS_SET, browsers7)
      })
      expect(getByTestId('picker-window')).toHaveStyle(`
          width: 300px;
          height: 350px;
        `)
    })

    it('should size correctly for 9 browsers', () => {
      const { getByTestId } = render(<App />)
      const win = new electron.remote.BrowserWindow()
      act(() => {
        win.webContents.send(BROWSERS_SET, browsers9)
      })
      expect(getByTestId('picker-window')).toHaveStyle(`
          width: 300px;
          height: 350px;
        `)
    })
  })
})
