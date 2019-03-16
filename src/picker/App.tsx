import * as React from 'react'
import { config, useSpring } from 'react-spring/web.cjs'
import { Activity, EAppState } from '../model'
import {
  ActivityButton,
  CopyButton,
  Key,
  Url,
  Window,
  LoadingText,
  ActivitiesWrapper,
  ActivityImg,
} from './StyledComponents'

const App = ({
  activities,
  isVisible,
  onActivityClick,
  onCopyToClipboard,
  onWindowAnimationEnd,
  onWindowClick,
  state,
  url,
  fav,
}: {
  activities: Activity[]
  isVisible: boolean
  onActivityClick: (actName: string) => void
  onCopyToClipboard: () => void
  onWindowAnimationEnd: () => void
  onWindowClick: () => void
  state: EAppState
  url: string | null
  fav: string | null
}) => {
  const windowSpringStyles = useSpring({
    opacity: isVisible ? 1 : 0,
    config: config.stiff,
    onRest: onWindowAnimationEnd,
  })
  const activitySpringStyles = useSpring({
    transform: `scale(${isVisible ? 1 : 0})`,
    transformOrigin: 'center center',
    config: config.wobbly,
  })
  return (
    <Window style={windowSpringStyles} onClick={onWindowClick}>
      {state === EAppState.IDLE || state === EAppState.PENDING ? (
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
                  onActivityClick(activity.name)
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
      <CopyButton onClick={onCopyToClipboard}>Copy To Clipboard</CopyButton>
    </Window>
  )
}

export default App
