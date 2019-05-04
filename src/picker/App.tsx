import a from '@artossystems/a'
import { ipcRenderer } from 'electron'
import produce from 'immer'
import * as mousetrap from 'mousetrap'
import * as React from 'react'
import {
  ACTIVITIES_SET,
  ACTIVITY_RUN,
  COPY_TO_CLIPBOARD,
  FAV_SET,
  URL_RECEIVED,
} from '../config/events'
import { Activity } from '../model'
import {
  ActivityButton,
  ActivityImg,
  // CopyButton,
  Key,
  // LoadingText,
  Url,
  Window,
  PickerWindow,
  // WindowInner,
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

const initialState: State = {
  isVisible: false,
  url: null,
  activities: [],
  fav: null,
  x: 0,
  y: 0,
}

const reducer = produce(
  (
    state: State,
    action: AUrlReceived | AFavSet | AActivitiesSet | AHide | AShow,
  ) => {
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
        ipcRenderer.send('CLOSE_WINDOW')
        return
      case AShow.TYPE:
        state.x = action.x
        state.y = action.y
        state.isVisible = true
        return
    }
  },
)

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

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
    ipcRenderer.on('WINDOW_BLUR', () => dispatch(AHide()))

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
      ipcRenderer.removeAllListeners('WINDOW_BLUR')
      ipcRenderer.removeAllListeners(URL_RECEIVED)
      ipcRenderer.removeAllListeners(FAV_SET)
      ipcRenderer.removeAllListeners(ACTIVITIES_SET)
    }
  }, [])

  const favActivities = state.activities.filter(act => act.name === state.fav)
  // const notFavActivities = state.activities.filter(
  //   act => act.name !== state.fav,
  // )
  // const leftActivities = notFavActivities.filter(
  //   (_, i) => i < notFavActivities.length / 2,
  // )
  // const rightActivities = notFavActivities.filter(
  //   (_, i) => i >= notFavActivities.length / 2,
  // )

  const onMouseEnter = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!state.isVisible) {
        ipcRenderer.send(
          'LOG',
          JSON.stringify(
            {
              innerWidth: window.innerWidth,
              innerHeight: window.innerHeight,
              x: e.clientX,
              y: e.clientY,
            },
            null,
            2,
          ),
        )
        dispatch(AShow({ x: e.clientX, y: e.clientY }))
      }
    },
    [state.isVisible],
  )

  const pickerHeight = 150
  const isAtBottom = state.y > window.innerHeight - pickerHeight
  const top = isAtBottom ? state.y - pickerHeight : state.y

  const pickerWidth = 150
  const isAtRight = state.x > window.innerWidth - pickerWidth
  const left = isAtRight ? state.x - pickerWidth : state.x

  return (
    <Window onClick={() => dispatch(AHide())} onMouseEnter={onMouseEnter}>
      {state.isVisible && (
        <React.Fragment>
          <Url>{state.url}</Url>
          <PickerWindow style={{ top, left }}>
            {favActivities.map(activity => (
              <ActivityButton
                key={activity.name}
                onClick={e => {
                  e.stopPropagation()
                  ipcRenderer.send(ACTIVITY_RUN, activity.name)
                }}
                role="button"
                fav
              >
                <ActivityImg
                  src={`../images/activity-icons/${activity.name}.png`}
                  alt={activity.name}
                />
                <Key>{activity.hotKey}</Key>
              </ActivityButton>
            ))}
          </PickerWindow>
        </React.Fragment>
      )}
    </Window>
  )
}

export default App

/* <WindowInner>
          {state.activities.length === 0 ? (
            <LoadingText>Loading...</LoadingText>
          ) : (
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                {leftActivities.map(activity => (
                  <ActivityButton
                    key={activity.name}
                    onClick={e => {
                      e.stopPropagation()
                      dispatch(AHide())
                      setTimeout(
                        () => ipcRenderer.send(ACTIVITY_RUN, activity.name),
                        50,
                      )
                    }}
                    role="button"
                  >
                    <ActivityImg
                      src={`../images/activity-icons/${activity.name}.png`}
                      alt={activity.name}
                    />
                    <Key>{activity.hotKey}</Key>
                  </ActivityButton>
                ))}
              </div>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {favActivities.map(activity => (
                  <ActivityButton
                    key={activity.name}
                    onClick={e => {
                      e.stopPropagation()
                      dispatch(AHide())
                      setTimeout(
                        () => ipcRenderer.send(ACTIVITY_RUN, activity.name),
                        50,
                      )
                    }}
                    role="button"
                    fav
                  >
                    <ActivityImg
                      src={`../images/activity-icons/${activity.name}.png`}
                      alt={activity.name}
                    />
                    <Key>{activity.hotKey}</Key>
                  </ActivityButton>
                ))}
              </div>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                {rightActivities.map(activity => (
                  <ActivityButton
                    key={activity.name}
                    onClick={e => {
                      e.stopPropagation()
                      dispatch(AHide())
                      setTimeout(
                        () => ipcRenderer.send(ACTIVITY_RUN, activity.name),
                        50,
                      )
                    }}
                    role="button"
                  >
                    <ActivityImg
                      src={`../images/activity-icons/${activity.name}.png`}
                      alt={activity.name}
                    />
                    <Key>{activity.hotKey}</Key>
                  </ActivityButton>
                ))}
              </div>
            </div>
          )}
        </WindowInner> */

/* <div>
          <Url>{state.url}</Url>
          <CopyButton
            onClick={() => {
              dispatch(AHide())
              setTimeout(() => ipcRenderer.send(COPY_TO_CLIPBOARD), 50)
            }}
          >
            Copy To Clipboard
          </CopyButton>
        </div> */
