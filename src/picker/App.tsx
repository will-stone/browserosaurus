import a from '@artossystems/a'
import { ipcRenderer } from 'electron'
import produce from 'immer'
import * as mousetrap from 'mousetrap'
import * as React from 'react'
import * as url from 'url'
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

const { useMemo, useEffect, useCallback, useReducer } = React

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
      setTimeout(() => ipcRenderer.send(CLOSE_WINDOW), 250)
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

  // Se-up event listeners
  useEffect(() => {
    /**
     * Global keyboard shortcuts
     */
    mousetrap.bind('esc', e => {
      e.preventDefault()
      dispatch(AHide())
    })

    mousetrap.bind('space', e => {
      e.preventDefault() // stops space from opening previously selected act
      ipcRenderer.send(COPY_TO_CLIPBOARD)
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
      mousetrap.bind('enter', () => ipcRenderer.send(ACTIVITY_RUN, name))
    })

    ipcRenderer.on(
      ACTIVITIES_SET,
      (_: unknown, receivedActivities: Activity[]) => {
        // setup hotkeys
        receivedActivities.forEach(act => {
          mousetrap.bind(act.hotKey, () => {
            ipcRenderer.send(ACTIVITY_RUN, act.name)
          })
        })
        dispatch(AActivitiesSet({ activities: receivedActivities }))
      },
    )

    return function cleanup() {
      ipcRenderer.removeAllListeners(WINDOW_BLUR)
      ipcRenderer.removeAllListeners(URL_RECEIVED)
      ipcRenderer.removeAllListeners(FAV_SET)
      ipcRenderer.removeAllListeners(ACTIVITIES_SET)
    }
  }, [])

  const favActivity = useMemo(
    () => state.activities.find(act => act.name === state.fav),
    [state.activities, state.fav],
  )

  const notFavActivities = useMemo(
    () => state.activities.filter(act => act.name !== state.fav),
    [state.activities, state.fav],
  )

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

  const [width, height] = useMemo(
    () => [
      (favActivity ? 200 : 0) +
        (!favActivity && notFavActivities.length >= 3
          ? 3
          : notFavActivities.length >= 2
          ? 2
          : notFavActivities.length) *
          100,
      (favActivity ? 200 : 100) +
        (notFavActivities.length > 0
          ? (Math.ceil(notFavActivities.length / 4) - 1) * 100
          : 0),
    ],
    [favActivity, notFavActivities.length],
  )

  const [isAtRight, isAtBottom] = useMemo(
    () => [
      state.x > window.innerWidth - width,
      state.y > window.innerHeight - height,
    ],
    [height, state.x, state.y, width],
  )

  const [left, top] = useMemo(
    () => [
      isAtRight ? state.x - width - 1 : state.x + 1,
      isAtBottom ? state.y - height : state.y,
    ],
    [height, isAtBottom, isAtRight, state.x, state.y, width],
  )

  const transformOrigin = useMemo(
    () => `${isAtRight ? 'right' : 'left'} ${isAtBottom ? 'bottom' : 'top'}`,
    [isAtBottom, isAtRight],
  )

  const u = useMemo(() => url.parse(state.url || ''), [state.url])

  const urlClassName = useMemo(
    () => 'url' + (state.isVisible ? ' url--isVisible' : ''),
    [state.isVisible],
  )

  const pickerWindowClassName = useMemo(
    () => 'pickerWindow' + (state.isVisible ? ' pickerWindow--isVisible' : ''),
    [state.isVisible],
  )

  const pickerWindowInnerTransform = useMemo(
    () =>
      (isAtRight && isAtBottom) || isAtBottom
        ? 'rotate(180deg)'
        : 'rotate(0deg)',
    [isAtBottom, isAtRight],
  )

  const activityFloat = useMemo(
    () =>
      (isAtRight && !isAtBottom) || (isAtBottom && !isAtRight)
        ? 'right'
        : 'left',
    [isAtBottom, isAtRight],
  )

  const activityTransform = useMemo(
    () =>
      (isAtRight && isAtBottom) || isAtBottom
        ? 'rotate(180deg)'
        : 'rotate(0deg)',
    [isAtBottom, isAtRight],
  )

  return (
    <div
      className="window"
      onClick={e => {
        e.preventDefault()
        dispatch(AHide())
      }}
      id="window"
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
    >
      <div
        className={urlClassName}
        onClick={e => {
          e.stopPropagation()
          ipcRenderer.send(COPY_TO_CLIPBOARD)
          dispatch(AHide())
        }}
      >
        <span>
          <span>
            {u.protocol && u.protocol.includes('s') && (
              <svg
                className="url__lockIcon"
                aria-hidden="true"
                focusable="false"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zM264 392c0 22.1-17.9 40-40 40s-40-17.9-40-40v-48c0-22.1 17.9-40 40-40s40 17.9 40 40v48zm32-168H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"
                />
              </svg>
            )}
          </span>
          <span className="url__hostname">{u.hostname}</span>
          <span>{u.port && ':' + u.port}</span>
          <span>{u.pathname}</span>
          <span>{u.search}</span>
          <span>{u.hash}</span>
        </span>
      </div>
      <div
        className={pickerWindowClassName}
        style={{
          top,
          left,
          width,
          height,
          transformOrigin,
        }}
      >
        <div
          className="pickerWindow__inner"
          style={{ transform: pickerWindowInnerTransform }}
        >
          {favActivity && (
            <button
              className="activity activity--isFav"
              onClick={e => {
                e.stopPropagation()
                ipcRenderer.send(ACTIVITY_RUN, favActivity.name)
              }}
              role="button"
              style={{
                float: activityFloat,
                transform: activityTransform,
              }}
            >
              <img
                className="activity__img"
                src={`../images/activity-icons/${favActivity.name}.png`}
                alt={favActivity.name}
              />
              <div className="key">{favActivity.hotKey}</div>
            </button>
          )}
          <div>
            {notFavActivities.map(activity => (
              <button
                className="activity"
                key={activity.name}
                onClick={e => {
                  e.stopPropagation()
                  ipcRenderer.send(ACTIVITY_RUN, activity.name)
                }}
                role="button"
                style={{
                  float: activityFloat,
                  transform: activityTransform,
                }}
              >
                <img
                  className="activity__img"
                  src={`../images/activity-icons/${activity.name}.png`}
                  alt={activity.name}
                />
                <div className="key">{activity.hotKey}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
