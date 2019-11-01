import './App.css'

import a from '@artossystems/a'
import { ipcRenderer } from 'electron'
import produce from 'immer'
import * as mousetrap from 'mousetrap'
import * as React from 'react'

import {
  CLOSE_WINDOW,
  MOUSE_THROUGH_DISABLE,
  MOUSE_THROUGH_ENABLE,
  WINDOW_BLUR,
} from '../config/events'
import { Bluebar } from './features/Bluebar'
import { Picker } from './features/Picker'

const { useEffect, useCallback, useReducer } = React

/**
 * ACTIONS
 */
const AMouseMove = a('MOUSE/MOVE', {} as { target?: string })
const AMouseEnter = a('MOUSE/ENTER', {} as { x: number; y: number })
const AEscapeKey = a('ESCAPE_KEY')
const ABlurWindow = a('WINDOW/BLUR')
const AClickWindow = a('WINDOW/CLICK')
type AMouseMove = ReturnType<typeof AMouseMove>
type AMouseEnter = ReturnType<typeof AMouseEnter>
type AEscapeKey = ReturnType<typeof AEscapeKey>
type ABlurWindow = ReturnType<typeof ABlurWindow>
type AClickWindow = ReturnType<typeof AClickWindow>

type Actions =
  | AMouseEnter
  | AMouseMove
  | AEscapeKey
  | ABlurWindow
  | AClickWindow

interface State {
  isVisible: boolean
  x: number
  y: number
  mouseTarget?: string
}

const initialState: State = {
  isVisible: false,
  x: 0,
  y: 0,
}

const reducer = produce((state: State, action: Actions) => {
  switch (action.type) {
    case AEscapeKey.TYPE:
    case ABlurWindow.TYPE:
    case AClickWindow.TYPE:
      state.isVisible = false
      setTimeout(() => ipcRenderer.send(CLOSE_WINDOW), 200)
      return
    case AMouseEnter.TYPE:
      if (!state.isVisible) {
        state.x = action.x
        state.y = action.y
        state.isVisible = true
      }
      return
    case AMouseMove.TYPE:
      state.mouseTarget = action.target
      return
  }
})

const App: React.FC = () => {
  const [state, dispatch] = useReducer<React.Reducer<State, Actions>>(
    reducer,
    initialState,
  )

  // Set-up event listeners
  useEffect(() => {
    /**
     * Global keyboard shortcuts
     */
    mousetrap.bind('esc', e => {
      e.preventDefault()
      dispatch(AEscapeKey())
    })

    /**
     * Events from main process
     */
    ipcRenderer.on(WINDOW_BLUR, () => dispatch(ABlurWindow()))

    return function cleanup() {
      ipcRenderer.removeAllListeners(WINDOW_BLUR)
    }
  }, [])

  const onMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
      dispatch(AMouseEnter({ x: e.clientX, y: e.clientY })),
    [dispatch],
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
      dispatch(AMouseMove({ target: (e.target as Element).id })),
    [dispatch],
  )

  /**
   * Allows clicking through the window so that the window underneath gets
   * full focus.
   */
  useEffect(() => {
    if (state.mouseTarget === 'window') {
      ipcRenderer.send(MOUSE_THROUGH_ENABLE)
    } else {
      ipcRenderer.send(MOUSE_THROUGH_DISABLE)
    }
  }, [state.mouseTarget])

  return (
    <div
      className="App"
      onClick={() => dispatch(AClickWindow())}
      id="window"
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
    >
      <Bluebar isVisible={state.isVisible} />
      <Picker x={state.x} y={state.y} isVisible={state.isVisible} />
    </div>
  )
}

export default App
