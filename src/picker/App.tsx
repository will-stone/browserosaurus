import a from '@artossystems/a'
import { ipcRenderer } from 'electron'
import produce from 'immer'
import * as mousetrap from 'mousetrap'
import * as React from 'react'
import { Manager, Reference, Popper } from 'react-popper'
import {
  ACTIVITIES_SET,
  ACTIVITY_RUN,
  COPY_TO_CLIPBOARD,
  FAV_SET,
  URL_RECEIVED,
  URL_RESET,
} from '../config/events'
import { Activity } from '../model'
import {
  ActivityButton,
  ActivityImg,
  CopyButton,
  Key,
  LoadingText,
  Url,
  Window,
  WindowInner,
} from './StyledComponents'

const AHide = a('HIDE')
const AUrlReceived = a(URL_RECEIVED, {} as { url: string })
const AFavSet = a(FAV_SET, {} as { name: string })
const AActivitiesSet = a(ACTIVITIES_SET, {} as { activities: Activity[] })
type AHide = ReturnType<typeof AHide>
type AUrlReceived = ReturnType<typeof AUrlReceived>
type AFavSet = ReturnType<typeof AFavSet>
type AActivitiesSet = ReturnType<typeof AActivitiesSet>

interface State {
  isVisible: boolean
  url: string | null
  activities: Activity[]
  fav: string | null
}

const initialState: State = {
  isVisible: false,
  url: null,
  activities: [],
  fav: null,
}

const reducer = produce(
  (state: State, action: AUrlReceived | AFavSet | AActivitiesSet | AHide) => {
    switch (action.type) {
      case AActivitiesSet.TYPE:
        state.activities = action.activities
        return
      case AUrlReceived.TYPE:
        state.isVisible = true
        state.url = action.url
        return
      case AFavSet.TYPE:
        state.fav = action.name
        return
      case AHide.TYPE:
        state.isVisible = false
        return
    }
  },
)

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const [mousePos, setMousePos] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  // Se-up event listeners
  React.useEffect(() => {
    mousetrap.bind('esc', () => ipcRenderer.send(URL_RESET))
    mousetrap.bind('space', e => {
      e.preventDefault() // stops space from opening previously selected act
      ipcRenderer.send(COPY_TO_CLIPBOARD)
    })
    ipcRenderer.on(URL_RECEIVED, (_: unknown, receivedUrl: string) => {
      dispatch(AUrlReceived({ url: receivedUrl }))
    })
    ipcRenderer.on(FAV_SET, (_: unknown, receivedFav: string) => {
      dispatch(AFavSet({ name: receivedFav }))
      mousetrap.bind('enter', () => ipcRenderer.send(ACTIVITY_RUN, receivedFav))
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
      ipcRenderer.removeAllListeners(URL_RECEIVED)
      ipcRenderer.removeAllListeners(FAV_SET)
      ipcRenderer.removeAllListeners(ACTIVITIES_SET)
    }
  }, [])

  const favActivities = state.activities.filter(act => act.name === state.fav)
  const notFavActivities = state.activities.filter(
    act => act.name !== state.fav,
  )
  const leftActivities = notFavActivities.filter(
    (_, i) => i < notFavActivities.length / 2,
  )
  const rightActivities = notFavActivities.filter(
    (_, i) => i >= notFavActivities.length / 2,
  )

  return (
    <Manager>
      <Window
        onClick={() => {
          dispatch(AHide())
          setTimeout(() => ipcRenderer.send(URL_RESET), 50)
        }}
        onMouseEnter={e => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        <Reference>
          {({ ref }) => (
            <div
              ref={ref}
              style={{
                position: 'absolute',
                top: mousePos.y,
                left: mousePos.x,
                width: 0,
                height: 0,
              }}
            />
          )}
        </Reference>
        {state.isVisible && mousePos.x !== 0 && (
          <Popper placement="left">
            {({ ref, style, placement }) => (
              <div
                ref={ref}
                style={{
                  ...style,
                  width: 100,
                  height: 100,
                  backgroundColor: 'red',
                }}
                data-placement={placement}
              >
                Popper element
                {/* <div ref={arrowProps.ref} style={arrowProps.style} /> */}
              </div>
            )}
          </Popper>
        )}
        <WindowInner>
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
        </WindowInner>
        <div>
          <Url>{state.url}</Url>
          <CopyButton
            onClick={() => {
              dispatch(AHide())
              setTimeout(() => ipcRenderer.send(COPY_TO_CLIPBOARD), 50)
            }}
          >
            Copy To Clipboard
          </CopyButton>
        </div>
      </Window>
    </Manager>
  )
}

export default App
