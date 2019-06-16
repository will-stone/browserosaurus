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
import { logger } from '../utils/logger'

const { useEffect, useCallback, useReducer } = React

/**
 * ACTIONS
 */
const ASetMouseTarget = a('MOUSE/SET_TARGET', {} as { target?: string })
const AShow = a('SHOW', {} as { x: number; y: number })
const AHide = a('HIDE')
const AUrlReceived = a(URL_RECEIVED, {} as { url: string })
const AFavSet = a(FAV_SET, {} as { name: string })
const AActivitiesSet = a(ACTIVITIES_SET, {} as { activities: Activity[] })
type ASetMouseTarget = ReturnType<typeof ASetMouseTarget>
type AShow = ReturnType<typeof AShow>
type AHide = ReturnType<typeof AHide>
type AUrlReceived = ReturnType<typeof AUrlReceived>
type AFavSet = ReturnType<typeof AFavSet>
type AActivitiesSet = ReturnType<typeof AActivitiesSet>

type Actions =
  | AUrlReceived
  | AFavSet
  | AActivitiesSet
  | AHide
  | AShow
  | ASetMouseTarget

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
    case AHide.TYPE:
      state.isVisible = false
      setTimeout(() => ipcRenderer.send(CLOSE_WINDOW), 200)
      return
    case AShow.TYPE:
      state.x = action.x
      state.y = action.y
      state.isVisible = true
      return
    case ASetMouseTarget.TYPE:
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
      dispatch(AHide())
    })

    /**
     * Events from main process
     */
    ipcRenderer.on(WINDOW_BLUR, () => dispatch(AHide()))

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

      mousetrap.bind('alt', () => logger('keyup'), 'keyup')
      mousetrap.bind('alt', () => logger('keydown'), 'keydown')
    })

    return function cleanup() {
      ipcRenderer.removeAllListeners(WINDOW_BLUR)
      ipcRenderer.removeAllListeners(URL_RECEIVED)
      ipcRenderer.removeAllListeners(FAV_SET)
      ipcRenderer.removeAllListeners(ACTIVITIES_SET)
    }
  }, [dispatch])

  const onMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!state.isVisible) {
        dispatch(AShow({ x: e.clientX, y: e.clientY }))
      }
    },
    [dispatch, state.isVisible],
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      dispatch(ASetMouseTarget({ target: (e.target as Element).id }))
    },
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
        dispatch(AHide())
      }}
      id="window"
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
    >
      <Bluebar
        isVisible={state.isVisible}
        onClick={e => {
          e.stopPropagation()
          ipcRenderer.send(COPY_TO_CLIPBOARD)
          dispatch(AHide())
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
