import * as React from 'react'
import { config, Spring } from 'react-spring'
import { Activity, EAppState } from '../model'
import { ActivityButton } from './styledComponents/ActivityButton'
import { CopyButton } from './styledComponents/CopyButton'
import { Key } from './styledComponents/Key'
import { Url } from './styledComponents/Url'
import { Window } from './styledComponents/Window'

const App = ({
  activities,
  isVisible,
  onActivityClick,
  onCopyToClipboard,
  onWindowAnimationEnd,
  onWindowClick,
  state,
  url,
}: {
  activities: Activity[]
  isVisible: boolean
  onActivityClick: (act: Activity) => void
  onCopyToClipboard: () => void
  onWindowAnimationEnd: () => void
  onWindowClick: () => void
  state: EAppState
  url: string | null
}) => {
  return (
    <Spring to={{ opacity: isVisible ? 1 : 0 }} onRest={onWindowAnimationEnd} config={config.stiff}>
      {windowSpringStyles => (
        <Window style={windowSpringStyles} onClick={onWindowClick}>
          {state === EAppState.IDLE || state === EAppState.PENDING ? (
            <div style={{ textAlign: 'center' }}>Loading...</div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              {activities
                .sort((a, b) => (a.fav ? -1 : b.fav ? 1 : 0))
                .map(activity => (
                  <Spring
                    key={activity.name}
                    to={{
                      transform: `scale(${isVisible ? 1 : 0})`,
                      transformOrigin: 'center center',
                    }}
                    config={config.wobbly}
                  >
                    {activitySpringStyles => (
                      <ActivityButton
                        onClick={e => {
                          e.stopPropagation()
                          onActivityClick(activity)
                        }}
                        style={{
                          ...activitySpringStyles,
                          display: activity.fav ? 'block' : 'inline-flex',
                          height: activity.fav ? '200px' : '150px',
                          marginLeft: activity.fav ? 'auto' : '30px',
                          marginRight: activity.fav ? 'auto' : '30px',
                          width: activity.fav ? '200px' : '150px',
                        }}
                      >
                        <img
                          src={`../images/activity-icons/${activity.name}.png`}
                          alt={activity.name}
                          style={{
                            display: 'block',
                            width: '100%',
                          }}
                        />
                        <Key>{activity.hotKey}</Key>
                      </ActivityButton>
                    )}
                  </Spring>
                ))}
            </div>
          )}
          <Url>{url}</Url>
          <CopyButton onClick={onCopyToClipboard}>Copy To Clipboard</CopyButton>
        </Window>
      )}
    </Spring>
  )
}

export default App
