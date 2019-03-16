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

const App: React.FC = () => {
  const [url, setUrl] = React.useState<string | null>(null)
  const [isVisible, setIsVisible] = React.useState<boolean>(false)
  const [activities, setActivities] = React.useState<Activity[]>([])
  const [fav, setFav] = React.useState<string | null>(null)

  const handleRunActivity = React.useCallback(
    (activityName: string) => {
      if (isVisible && url) {
        ipcRenderer.send(ACTIVITY_RUN, { name: activityName, url })
        setIsVisible(false)
      }
    },
    [isVisible, url],
  )

  // Receive URL
  React.useEffect(() => {
    ipcRenderer.on(URL_RECEIVED, (_: unknown, receivedUrl: string) => {
      setIsVisible(true)
      setUrl(receivedUrl)
    })
    return () => ipcRenderer.removeAllListeners(URL_RECEIVED)
  }, [])

  // Fav
  React.useEffect(() => {
    ipcRenderer.on(FAV_SET, (_: unknown, receivedFav: string) => {
      setFav(receivedFav)
      mousetrap.bind('enter', () => handleRunActivity(receivedFav))
    })
    return () => ipcRenderer.removeAllListeners(FAV_SET)
  }, [handleRunActivity])

  // Blur Picker
  React.useEffect(() => {
    ipcRenderer.on(PICKER_BLUR, () => setIsVisible(false))
    return () => ipcRenderer.removeAllListeners(PICKER_BLUR)
  }, [])

  const handleCopyToClipboard = React.useCallback(() => {
    if (isVisible && url) {
      copyToClipboard(url)
      setIsVisible(false)
    }
  }, [isVisible, url])

  // Set Activities
  React.useEffect(() => {
    ipcRenderer.on(ACTIVITIES_SET, (_: unknown, receivedActivities: Activity[]) => {
      // setup hotkeys
      receivedActivities.forEach(act => {
        mousetrap.bind(act.hotKey, () => handleRunActivity(act.name))
      })
      setActivities(receivedActivities)
    })
    return () => ipcRenderer.removeAllListeners(ACTIVITIES_SET)
  }, [handleRunActivity])

  React.useEffect(() => {
    // setup common hotkeys
    mousetrap.bind('esc', () => setIsVisible(false))
    mousetrap.bind('space', handleCopyToClipboard)
  }, [handleCopyToClipboard])

  const windowSpringStyles = useSpring({
    opacity: isVisible ? 1 : 0,
    config: config.stiff,
    onRest: () => !isVisible && ipcRenderer.send(WINDOW_HIDE),
  })

  const activitySpringStyles = useSpring({
    transform: `scale(${isVisible ? 1 : 0})`,
    transformOrigin: 'center center',
    config: config.wobbly,
  })

  return (
    <Window style={windowSpringStyles} onClick={() => setIsVisible(false)}>
      {activities.length === 0 ? (
        <LoadingText>Loading...</LoadingText>
      ) : (
        <ActivitiesWrapper>
          {activities
            .sort((a, b) => (a.name === fav ? -1 : b.name === fav ? 1 : 0))
            .map(activity => (
              <ActivityButton
                key={activity.name}
                onClick={e => {
                  e.stopPropagation()
                  handleRunActivity(activity.name)
                }}
                fav={activity.name === fav ? 'fav' : undefined}
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
      <Url>{url}</Url>
      <CopyButton onClick={handleCopyToClipboard}>Copy To Clipboard</CopyButton>
    </Window>
  )
}

export default App
