import { ipcRenderer } from 'electron'
import * as mousetrap from 'mousetrap'
import * as React from 'react'
import { config, useSpring } from 'react-spring/web.cjs'
import {
  ACTIVITIES_SET,
  ACTIVITY_RUN,
  PICKER_BLUR,
  URL_RECEIVED,
  WINDOW_HIDE,
  FAV_SET,
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
import { copyToClipboard } from '../utils/copyToClipboard'
import a from '@artossystems/a'

const AUrlReceived = a(URL_RECEIVED, {} as { url: string })
const APickerBlur = a(PICKER_BLUR)
const ARunActivity = a('RUN_ACTIVITY', {} as { name: string })
const AFavSet = a(FAV_SET, {} as { name: string })
const ACopyToClipboard = a('COPY_TO_CLIPBOARD')
const AActivitiesSet = a(ACTIVITIES_SET, {} as { activities: Activity[] })
type AUrlReceived = ReturnType<typeof AUrlReceived>
type APickerBlur = ReturnType<typeof APickerBlur>
type ARunActivity = ReturnType<typeof ARunActivity>
type AFavSet = ReturnType<typeof AFavSet>
type ACopyToClipboard = ReturnType<typeof ACopyToClipboard>
type AActivitiesSet = ReturnType<typeof AActivitiesSet>

interface State {
  url: string | null
  isVisible: boolean
  activities: Activity[]
  fav: string | null
}

const initialState: State = { url: null, isVisible: false, activities: [], fav: null }

const reducer = (
  state: State,
  action: AUrlReceived | APickerBlur | ARunActivity | AFavSet | ACopyToClipboard | AActivitiesSet,
) => {
  switch (action.type) {
    case AActivitiesSet.TYPE:
      return {
        ...state,
        activities: action.activities,
      }
    case AUrlReceived.TYPE:
      return {
        ...state,
        url: action.url,
        isVisible: true,
      }
    case APickerBlur.TYPE:
      return {
        ...state,
        isVisible: false,
      }
    case ARunActivity.TYPE: {
      ipcRenderer.send(ACTIVITY_RUN, { name: action.name, url: state.url })
      return {
        ...state,
        isVisible: false,
      }
    }
    case AFavSet.TYPE:
      return {
        ...state,
        fav: action.name,
      }
    case ACopyToClipboard.TYPE: {
      state.url && copyToClipboard(state.url)
      return {
        ...state,
        isVisible: false,
      }
    }
    default:
      return state
  }
}

const App: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  // Se-up event listeners
  React.useEffect(() => {
    mousetrap.bind('esc', () => dispatch(APickerBlur()))
    mousetrap.bind('space', () => dispatch(ACopyToClipboard()))
    ipcRenderer.on(URL_RECEIVED, (_: unknown, receivedUrl: string) =>
      dispatch(AUrlReceived({ url: receivedUrl })),
    )
    ipcRenderer.on(FAV_SET, (_: unknown, receivedFav: string) => {
      dispatch(AFavSet({ name: receivedFav }))
      mousetrap.bind('enter', () => dispatch(ARunActivity({ name: receivedFav })))
    })
    ipcRenderer.on(PICKER_BLUR, () => dispatch(APickerBlur()))
    ipcRenderer.on(ACTIVITIES_SET, (_: unknown, receivedActivities: Activity[]) => {
      // setup hotkeys
      receivedActivities.forEach(act => {
        mousetrap.bind(act.hotKey, () => dispatch(ARunActivity({ name: act.name })))
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
    onRest: () => !state.isVisible && ipcRenderer.send(WINDOW_HIDE),
  })

  const activitySpringStyles = useSpring({
    transform: `scale(${state.isVisible ? 1 : 0})`,
    transformOrigin: 'center center',
    config: config.wobbly,
  })

  return (
    <Window style={windowSpringStyles} onClick={() => dispatch(APickerBlur())}>
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
                  dispatch(ARunActivity({ name: activity.name }))
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
      <CopyButton onClick={() => dispatch(ACopyToClipboard())}>Copy To Clipboard</CopyButton>
    </Window>
  )
}

export default App
