import a from '@artossystems/a'
import { ipcRenderer } from 'electron'
import produce from 'immer'
import * as mousetrap from 'mousetrap'
import * as React from 'react'
import {
  ACTIVITIES_SET,
  ACTIVITY_RUN,
  CLOSE_WINDOW,
  COPY_TO_CLIPBOARD,
  FAV_SET,
  MOUSE_THROUGH_DISABLE,
  MOUSE_THROUGH_ENABLE,
  URL_RECEIVED,
  WINDOW_BLUR,
} from '../config/events'
import { Activity } from '../model'
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
const AUrlReceived = a(URL_RECEIVED, {} as { url: string })
const AFavSet = a(FAV_SET, {} as { name: string })
const AActivitiesSet = a(ACTIVITIES_SET, {} as { activities: Activity[] })
type AMouseMove = ReturnType<typeof AMouseMove>
type AMouseEnter = ReturnType<typeof AMouseEnter>
type AEscapeKey = ReturnType<typeof AEscapeKey>
type ABlurWindow = ReturnType<typeof ABlurWindow>
type AClickWindow = ReturnType<typeof AClickWindow>
type AClickBluebar = ReturnType<typeof AClickBluebar>
type AUrlReceived = ReturnType<typeof AUrlReceived>
type AFavSet = ReturnType<typeof AFavSet>
type AActivitiesSet = ReturnType<typeof AActivitiesSet>

type Actions =
  | AUrlReceived
  | AFavSet
  | AActivitiesSet
  | AMouseEnter
  | AMouseMove
  | AEscapeKey
  | ABlurWindow
  | AClickWindow
  | AClickBluebar

interface State {
  isVisible: boolean
  url: string | null
  activities: Activity[]
  fav: string | null
  x: number
  y: number
  mouseTarget?: string
}

const initialState: State = {
  isVisible: false,
  url: null,
  activities: [],
  fav: null,
  x: 0,
  y: 0,
}

const reducer = produce((state: State, action: Actions) => {
  switch (action.type) {
    case AActivitiesSet.TYPE:
      state.activities = action.activities
      return
    case AUrlReceived.TYPE:
      state.url = action.url
      return
    case AFavSet.TYPE:
      state.fav = action.name
      return
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

    ipcRenderer.on(URL_RECEIVED, (_: unknown, url: string) => {
      dispatch(AUrlReceived({ url }))
    })

    ipcRenderer.on(FAV_SET, (_: unknown, name: string) => {
      dispatch(AFavSet({ name }))
      mousetrap.bind('enter', e => {
        // When a browser has been selected with the mouse, it gets (invisible) focus.
        // This means when enter is pressed next, it will activate the focused activity AND fire
        // this key binding, causing two identical tabs to open in the selected browser.
        // This fixes that.
        e.preventDefault()
        ipcRenderer.send(ACTIVITY_RUN, name)
      })
    })

    ipcRenderer.on(ACTIVITIES_SET, (_: unknown, activities: Activity[]) => {
      // setup hotkeys
      activities.forEach(act => {
        if (act.hotKey) {
          mousetrap.bind(act.hotKey, e => {
            e.preventDefault()
            ipcRenderer.send(ACTIVITY_RUN, act.name)
          })
        }
      })
      dispatch(AActivitiesSet({ activities }))
    })

    return function cleanup() {
      ipcRenderer.removeAllListeners(WINDOW_BLUR)
      ipcRenderer.removeAllListeners(URL_RECEIVED)
      ipcRenderer.removeAllListeners(FAV_SET)
      ipcRenderer.removeAllListeners(ACTIVITIES_SET)
    }
  }, [dispatch])

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
        url={state.url}
      />

      <Picker
        activities={state.activities}
        fav={state.fav}
        x={state.x}
        y={state.y}
        isVisible={state.isVisible}
      />
    </Window>
  )
}

export default App
