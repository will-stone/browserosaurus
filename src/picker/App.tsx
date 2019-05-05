import a from '@artossystems/a'
import { ipcRenderer } from 'electron'
import produce from 'immer'
import * as mousetrap from 'mousetrap'
import * as React from 'react'
import { animated, config, useSpring } from 'react-spring/web.cjs'
import {
  ACTIVITIES_SET,
  ACTIVITY_RUN,
  COPY_TO_CLIPBOARD,
  FAV_SET,
  URL_RECEIVED,
  CLOSE_WINDOW,
  WINDOW_BLUR,
} from '../config/events'
import { Activity } from '../model'
import {
  ActivityButton,
  ActivityImg,
  Key,
  PickerWindow,
  Url,
  Window,
} from './StyledComponents'

const AShow = a('SHOW', {} as { x: number; y: number })
const AHide = a('HIDE')
const AUrlReceived = a(URL_RECEIVED, {} as { url: string })
const AFavSet = a(FAV_SET, {} as { name: string })
const AActivitiesSet = a(ACTIVITIES_SET, {} as { activities: Activity[] })
type AShow = ReturnType<typeof AShow>
type AHide = ReturnType<typeof AHide>
type AUrlReceived = ReturnType<typeof AUrlReceived>
type AFavSet = ReturnType<typeof AFavSet>
type AActivitiesSet = ReturnType<typeof AActivitiesSet>

interface State {
  isVisible: boolean
  url: string | null
  activities: Activity[]
  fav: string | null
  x: number
  y: number
}

type Actions = AUrlReceived | AFavSet | AActivitiesSet | AHide | AShow

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
      setTimeout(() => ipcRenderer.send(CLOSE_WINDOW), 150)
      return
    case AShow.TYPE:
      state.x = action.x
      state.y = action.y
      state.isVisible = true
      return
  }
})

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer<React.Reducer<State, Actions>>(
    reducer,
    initialState,
  )

  const fadeStyles = useSpring({
    opacity: state.isVisible ? 1 : 0,
    config: { ...config.stiff, duration: 100, clamp: true },
  })

  // Se-up event listeners
  React.useEffect(() => {
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

  const favActivity = state.activities.find(act => act.name === state.fav)
  const notFavActivities = state.activities.filter(
    act => act.name !== state.fav,
  )

  const onMouseEnter = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!state.isVisible) {
        dispatch(AShow({ x: e.clientX, y: e.clientY }))
      }
    },
    [state.isVisible],
  )

  // TODO: move the styles logic to StyledComponents
  const height =
    (favActivity ? 200 : 100) +
    (notFavActivities.length > 0
      ? (Math.ceil(notFavActivities.length / 4) - 1) * 100
      : 0)
  const isAtBottom = state.y > window.innerHeight - height
  const top = isAtBottom ? state.y - height : state.y

  const width =
    (favActivity ? 200 : 0) +
    (!favActivity && notFavActivities.length >= 3
      ? 3
      : notFavActivities.length >= 2
      ? 2
      : notFavActivities.length) *
      100
  const isAtRight = state.x > window.innerWidth - width
  const left = isAtRight ? state.x - width - 1 : state.x + 1

  return (
    <Window onClick={() => dispatch(AHide())} onMouseEnter={onMouseEnter}>
      <Url
        onClick={() => {
          ipcRenderer.send(COPY_TO_CLIPBOARD)
          dispatch(AHide())
        }}
      >
        {/* TODO: add styles to URL
        - bold domain
        - (unlocked) padlock for http(s) status
      */}
        <animated.span style={fadeStyles}>{state.url}</animated.span>
      </Url>
      <PickerWindow
        style={{
          ...fadeStyles,
          transform:
            (isAtRight && isAtBottom) || isAtBottom
              ? 'rotate(180deg)'
              : 'rotate(0deg)',
          top,
          left,
          width,
          height,
        }}
      >
        {favActivity && (
          <ActivityButton
            onClick={e => {
              e.stopPropagation()
              ipcRenderer.send(ACTIVITY_RUN, favActivity.name)
            }}
            role="button"
            style={{
              float:
                (isAtRight && !isAtBottom) || (isAtBottom && !isAtRight)
                  ? 'right'
                  : 'left',
              transform:
                (isAtRight && isAtBottom) || isAtBottom
                  ? 'rotate(180deg)'
                  : 'rotate(0deg)',
            }}
            fav
          >
            <ActivityImg
              src={`../images/activity-icons/${favActivity.name}.png`}
              alt={favActivity.name}
            />
            <Key>{favActivity.hotKey}</Key>
          </ActivityButton>
        )}
        <div>
          {notFavActivities.map(activity => (
            <ActivityButton
              key={activity.name}
              onClick={e => {
                e.stopPropagation()
                ipcRenderer.send(ACTIVITY_RUN, activity.name)
              }}
              role="button"
              style={{
                float:
                  (isAtRight && !isAtBottom) || (isAtBottom && !isAtRight)
                    ? 'right'
                    : 'left',
                transform:
                  (isAtRight && isAtBottom) || isAtBottom
                    ? 'rotate(180deg)'
                    : 'rotate(0deg)',
              }}
            >
              <ActivityImg
                src={`../images/activity-icons/${activity.name}.png`}
                alt={activity.name}
              />
              <Key>{activity.hotKey}</Key>
            </ActivityButton>
          ))}
        </div>
      </PickerWindow>
    </Window>
  )
}

export default App
