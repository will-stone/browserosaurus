import { Button, Spinner, Text } from '@blueprintjs/core'
import * as React from 'react'
import { Spring } from 'react-spring'
import { IActivity } from '../model'
import Activity from './Activity'
import Window from './Window'

const AppComponent = ({
  activities,
  isVisible,
  onActivityClick,
  onCopyToClipboard,
  onWindowAnimationEnd,
  state,
  url,
}: {
  activities: IActivity[]
  isVisible: boolean
  onActivityClick: (act: IActivity) => void
  onCopyToClipboard: () => void
  onWindowAnimationEnd: () => void
  state: 'idle' | 'pending' | 'fulfilled'
  url: string | null
}) => (
  <Spring
    to={{
      opacity: isVisible ? 1.5 : 0,
      transform: `scale(${isVisible ? 1 : 0})`,
      transformOrigin: '0 0',
    }}
    onRest={onWindowAnimationEnd}
    config={{
      clamp: false,
      friction: 20,
      tension: 180,
    }}
  >
    {styles => (
      <Window style={styles}>
        <div style={{ textAlign: 'center', fontSize: '1.2rem', padding: '1rem 1rem 0 1rem' }}>
          <Text ellipsize={true}>{url}</Text>
        </div>
        <div style={{ padding: '1rem' }}>
          <React.Fragment>
            {state === 'idle' || state === 'pending' ? (
              <div
                style={{
                  marginBottom: '1rem',
                  textAlign: 'center',
                }}
              >
                <Spinner intent="primary" className="bp3-small" />
              </div>
            ) : (
              <div
                style={{
                  marginBottom: '1rem',
                }}
              >
                {activities
                  .sort((a, b) => (a.favourite ? -1 : b.favourite ? 1 : 0))
                  .map(activity => (
                    <Activity
                      key={activity.name}
                      activity={activity}
                      onClick={() => onActivityClick(activity)}
                    />
                  ))}
              </div>
            )}
            <Button
              icon="clipboard"
              text="Copy To Clipboard"
              intent="primary"
              fill
              minimal
              onClick={onCopyToClipboard}
            />
          </React.Fragment>
        </div>
      </Window>
    )}
  </Spring>
)

export default AppComponent
