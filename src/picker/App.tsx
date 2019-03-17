import { ipcRenderer } from 'electron'
import * as mousetrap from 'mousetrap'
import * as React from 'react'
import { config, useSpring } from 'react-spring/web.cjs'
import {
  ACTIVITIES_SET,
  ACTIVITY_RUN,
  PICKER_BLUR,
  URL_RECEIVED,
  FAV_SET,
  WINDOW_HIDE_START,
  WINDOW_HIDE_END,
  COPY_TO_CLIPBOARD,
} from '../config/events'
import { Activity } from '../model'
import {
  ActivitiesWrapper,
  ActivityButton,
  ActivityImg,
  CopyButton,
  Key,
  LoadingText,
  Url,
  Window,
} from './StyledComponents'
import a from '@artossystems/a'
import produce from 'immer'

const AUrlReceived = a(URL_RECEIVED, {} as { url: string })
const APickerBlur = a(PICKER_BLUR)
const AFavSet = a(FAV_SET, {} as { name: string })
const AActivitiesSet = a(ACTIVITIES_SET, {} as { activities: Activity[] })
type AUrlReceived = ReturnType<typeof AUrlReceived>
type APickerBlur = ReturnType<typeof APickerBlur>
type AFavSet = ReturnType<typeof AFavSet>
type AActivitiesSet = ReturnType<typeof AActivitiesSet>

interface State {
  url: string | null
  isVisible: boolean
  activities: Activity[]
  fav: string | null
}

const initialState: State = { url: null, isVisible: false, activities: [], fav: null }

const reducer = produce(
  (state: State, action: AUrlReceived | APickerBlur | AFavSet | AActivitiesSet) => {
    switch (action.type) {
      case AActivitiesSet.TYPE:
        state.activities = action.activities
        return
      case AUrlReceived.TYPE:
        state.url = action.url
        state.isVisible = true
        return
      case APickerBlur.TYPE:
        state.isVisible = false
        return
      case AFavSet.TYPE:
        state.fav = action.name
        return
    }
  },
)

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  // Se-up event listeners
  React.useEffect(() => {
    mousetrap.bind('esc', () => {
      ipcRenderer.send(WINDOW_HIDE_START)
      dispatch(APickerBlur())
    })
    mousetrap.bind('space', e => {
      e.preventDefault() // stops space from opening previously selected act
      ipcRenderer.send(COPY_TO_CLIPBOARD)
      dispatch(APickerBlur())
    })
    ipcRenderer.on(URL_RECEIVED, (_: unknown, receivedUrl: string) => {
      dispatch(AUrlReceived({ url: receivedUrl }))
    })
    ipcRenderer.on(FAV_SET, (_: unknown, receivedFav: string) => {
      dispatch(AFavSet({ name: receivedFav }))
      mousetrap.bind('enter', () => {
        ipcRenderer.send(ACTIVITY_RUN, receivedFav)
        dispatch(APickerBlur())
      })
    })
    ipcRenderer.on(PICKER_BLUR, () => {
      ipcRenderer.send(WINDOW_HIDE_START)
      dispatch(APickerBlur())
    })
    ipcRenderer.on(ACTIVITIES_SET, (_: unknown, receivedActivities: Activity[]) => {
      // setup hotkeys
      receivedActivities.forEach(act => {
        mousetrap.bind(act.hotKey, () => {
          ipcRenderer.send(ACTIVITY_RUN, act.name)
          dispatch(APickerBlur())
        })
      })
      dispatch(AActivitiesSet({ activities: receivedActivities }))
    })
    return function cleanup() {
      ipcRenderer.removeAllListeners(URL_RECEIVED)
      ipcRenderer.removeAllListeners(FAV_SET)
      ipcRenderer.removeAllListeners(PICKER_BLUR)
      ipcRenderer.removeAllListeners(ACTIVITIES_SET)
    }
  }, [])

  const windowSpringStyles = useSpring({
    opacity: state.isVisible ? 1 : 0,
    config: config.stiff,
    onRest: () => ipcRenderer.send(WINDOW_HIDE_END),
  })

  const activitySpringStyles = useSpring({
    transform: `scale(${state.isVisible ? 1 : 0})`,
    transformOrigin: 'center center',
    config: config.wobbly,
  })

  return (
    <Window
      style={windowSpringStyles}
      onClick={() => {
        ipcRenderer.send(WINDOW_HIDE_START)
        dispatch(APickerBlur())
      }}
    >
      {state.activities.length === 0 ? (
        <LoadingText>Loading...</LoadingText>
      ) : (
        <ActivitiesWrapper>
          {state.activities
            .sort((a, b) => (a.name === state.fav ? -1 : b.name === state.fav ? 1 : 0))
            .map(activity => (
              <ActivityButton
                key={activity.name}
                onClick={e => {
                  e.stopPropagation()
                  ipcRenderer.send(ACTIVITY_RUN, activity.name)
                  dispatch(APickerBlur())
                }}
                fav={activity.name === state.fav ? 'fav' : undefined}
                style={activitySpringStyles}
                role="button"
              >
                <ActivityImg
                  src={`../images/activity-icons/${activity.name}.png`}
                  alt={activity.name}
                />
                <Key>{activity.hotKey}</Key>
              </ActivityButton>
            ))}
        </ActivitiesWrapper>
      )}
      <Url>{state.url}</Url>
      <CopyButton
        onClick={() => {
          ipcRenderer.send(COPY_TO_CLIPBOARD)
          dispatch(APickerBlur())
        }}
      >
        Copy To Clipboard
      </CopyButton>
    </Window>
  )
}

export default App
