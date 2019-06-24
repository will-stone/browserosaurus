import a from '@artossystems/a'
import { ipcRenderer } from 'electron'
import produce from 'immer'
import * as mousetrap from 'mousetrap'
import * as React from 'react'
import {
  CLOSE_WINDOW,
  COPY_TO_CLIPBOARD,
  MOUSE_THROUGH_DISABLE,
  MOUSE_THROUGH_ENABLE,
  WINDOW_BLUR,
} from '../config/events'
import { Window } from './atoms/Window'
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
const AClickBluebar = a('BLUEBAR/CLICK')
type AMouseMove = ReturnType<typeof AMouseMove>
type AMouseEnter = ReturnType<typeof AMouseEnter>
type AEscapeKey = ReturnType<typeof AEscapeKey>
type ABlurWindow = ReturnType<typeof ABlurWindow>
type AClickWindow = ReturnType<typeof AClickWindow>
type AClickBluebar = ReturnType<typeof AClickBluebar>

type Actions =
  | AMouseEnter
  | AMouseMove
  | AEscapeKey
  | ABlurWindow
  | AClickWindow
  | AClickBluebar

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
    case AClickBluebar.TYPE:
      state.isVisible = false
      ipcRenderer.send(COPY_TO_CLIPBOARD)
      setTimeout(() => ipcRenderer.send(CLOSE_WINDOW), 200)
      return
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
    <Window
      onClick={e => {
        e.preventDefault()
        dispatch(AClickWindow())
      }}
      id="window"
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
    >
      <Bluebar
        isVisible={state.isVisible}
        onClick={e => {
          e.stopPropagation()
          dispatch(AClickBluebar())
        }}
      />
      <Picker x={state.x} y={state.y} isVisible={state.isVisible} />
    </Window>
  )
}

export default App
