import * as electron from 'electron'
import * as React from 'react'
import { act, fireEvent, render, wait, within } from 'react-testing-library'
import {
  ACTIVITIES_SET,
  ACTIVITY_RUN,
  CLOSE_WINDOW,
  COPY_TO_CLIPBOARD,
  FAV_SET,
  URL_RECEIVED,
} from '../../config/events'
import App from '../App'
import {
  activities2,
  activities4,
  activities7,
  activities9,
  activities5,
} from '../__fixtures__/activities'

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
    getByText('example.com')
  })

  it('should display the received activities', () => {
    const { container, getByAltText, getByText, queryByAltText } = render(
      <App />,
    )
    expect(queryByAltText('Firefox')).not.toBeInTheDocument()
    expect(queryByAltText('Safari')).not.toBeInTheDocument()
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(ACTIVITIES_SET, activities2)
      fireEvent.mouseEnter(container.firstChild as Element)
    })
    getByAltText('Firefox')
    getByText('f')
    getByAltText('Safari')
    getByText('s')
  })

  it('should show picker window on mouse enter', () => {
    const { container, getByTestId } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(ACTIVITIES_SET, activities2)
      fireEvent.mouseEnter(container.firstChild as Element)
    })
    expect(getByTestId('picker-window')).toBeVisible()
  })

  it('should run favourite activity on activity click', () => {
    const { getByAltText, container } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(ACTIVITIES_SET, activities2)
      win.webContents.send(FAV_SET, 'Firefox')
      win.webContents.send(URL_RECEIVED, 'example.com')
      fireEvent.mouseEnter(container.firstChild as Element)
    })
    act(() => {
      fireEvent.click(getByAltText('Firefox'))
    })
    expect(electron.ipcRenderer.send).toBeCalledWith(ACTIVITY_RUN, 'Firefox')
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

  it('should CLOSE_WINDOW on background click', () => {
    const { container } = render(<App />)
    act(() => {
      fireEvent.click(container.firstChild as Element)
    })
    wait(() =>
      expect(electron.ipcRenderer.send).toHaveBeenCalledWith(CLOSE_WINDOW),
    )
  })

  it('should set browser as favourite', () => {
    const { container, queryAllByRole } = render(<App />)
    const win = new electron.remote.BrowserWindow()
    act(() => {
      win.webContents.send(ACTIVITIES_SET, activities2)
      win.webContents.send(URL_RECEIVED, 'example.com')
      fireEvent.mouseEnter(container.firstChild as Element)
    })
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
    wait(() => {
      expect(acts[0]).toHaveStyle('height: 200px')
      expect(acts[0]).toHaveStyle('width: 200px')
      expect(acts[1]).toHaveStyle('height: 100px')
      expect(acts[1]).toHaveStyle('width: 100px')
    })
  })

  describe('Picker Window', () => {
    describe('without a favourite', () => {
      it('should size correctly for 2 activities', () => {
        const { getByTestId } = render(<App />)
        const win = new electron.remote.BrowserWindow()
        act(() => {
          win.webContents.send(ACTIVITIES_SET, activities2)
        })
        expect(getByTestId('picker-window')).toHaveStyle(`
          width: 200px;
          height: 100px;
        `)
      })

      it('should size correctly for 4 activities', () => {
        const { getByTestId } = render(<App />)
        const win = new electron.remote.BrowserWindow()
        act(() => {
          win.webContents.send(ACTIVITIES_SET, activities4)
        })
        expect(getByTestId('picker-window')).toHaveStyle(`
          width: 300px;
          height: 200px;
        `)
      })

      it('should size correctly for 5 activities', () => {
        const { getByTestId } = render(<App />)
        const win = new electron.remote.BrowserWindow()
        act(() => {
          win.webContents.send(ACTIVITIES_SET, activities5)
        })
        expect(getByTestId('picker-window')).toHaveStyle(`
          width: 300px;
          height: 200px;
        `)
      })

      it('should size correctly for 7 activities', () => {
        const { getByTestId } = render(<App />)
        const win = new electron.remote.BrowserWindow()
        act(() => {
          win.webContents.send(ACTIVITIES_SET, activities7)
        })
        expect(getByTestId('picker-window')).toHaveStyle(`
          width: 300px;
          height: 300px;
        `)
      })

      it('should size correctly for 9 activities', () => {
        const { getByTestId } = render(<App />)
        const win = new electron.remote.BrowserWindow()
        act(() => {
          win.webContents.send(ACTIVITIES_SET, activities9)
        })
        expect(getByTestId('picker-window')).toHaveStyle(`
          width: 300px;
          height: 300px;
        `)
      })
    })

    describe('with a favourite', () => {
      it('should size correctly for 2 activities', () => {
        const { getByTestId } = render(<App />)
        const win = new electron.remote.BrowserWindow()
        act(() => {
          win.webContents.send(ACTIVITIES_SET, activities2)
          win.webContents.send(FAV_SET, 'Firefox')
        })
        expect(getByTestId('picker-window')).toHaveStyle(`
          width: 300px;
          height: 200px;
        `)
      })

      it('should size correctly for 4 activities', () => {
        const { getByTestId } = render(<App />)
        const win = new electron.remote.BrowserWindow()
        act(() => {
          win.webContents.send(ACTIVITIES_SET, activities4)
          win.webContents.send(FAV_SET, 'Firefox')
        })
        expect(getByTestId('picker-window')).toHaveStyle(`
          width: 400px;
          height: 200px;
        `)
      })

      it('should size correctly for 5 activities', () => {
        const { getByTestId } = render(<App />)
        const win = new electron.remote.BrowserWindow()
        act(() => {
          win.webContents.send(ACTIVITIES_SET, activities5)
          win.webContents.send(FAV_SET, 'Firefox')
        })
        expect(getByTestId('picker-window')).toHaveStyle(`
          width: 400px;
          height: 200px;
        `)
      })

      it('should size correctly for 7 activities', () => {
        const { getByTestId } = render(<App />)
        const win = new electron.remote.BrowserWindow()
        act(() => {
          win.webContents.send(ACTIVITIES_SET, activities7)
          win.webContents.send(FAV_SET, 'Firefox')
        })
        expect(getByTestId('picker-window')).toHaveStyle(`
          width: 400px;
          height: 300px;
        `)
      })

      it('should size correctly for 9 activities', () => {
        const { getByTestId } = render(<App />)
        const win = new electron.remote.BrowserWindow()
        act(() => {
          win.webContents.send(ACTIVITIES_SET, activities9)
          win.webContents.send(FAV_SET, 'Firefox')
        })
        expect(getByTestId('picker-window')).toHaveStyle(`
          width: 400px;
          height: 300px;
        `)
      })
    })
  })
})
