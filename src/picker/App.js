import { Button, Spinner, Text } from '@blueprintjs/core'
import React from 'react'
import { Spring } from 'react-spring'
import Activity from './Activity'
import Content from './Content'
import TitleBar from './TitleBar'
import Window from './Window'

const AppComponent = ({
  activities,
  isVisible,
  onActivityClick,
  onCopyToClipboard,
  onWindowAnimationEnd,
  state,
  url,
}) => (
  <Spring
    to={{
      opacity: isVisible ? 1.5 : 0,
      transform: `scale(${isVisible ? 1 : 0})`,
      transformOrigin: '0 0',
    }}
    onRest={onWindowAnimationEnd}
    config={{
      tension: 180,
      friction: 10,
      overshootClamping: true,
    }}
  >
    {styles => (
      <Window style={styles}>
        <TitleBar>
          <Text ellipsize={true}>{url}</Text>
        </TitleBar>
        <Content>
          <React.Fragment>
            {state === 'idle' || state === 'pending' ? (
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '1rem',
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
                  .sort((a, b) => (a.fovourite ? -1 : b.favourite ? 1 : 0))
                  .map(activity => (
                    <Activity
                      key={activity.name}
                      activity={activity}
                      onClick={() => onActivityClick(activity)}
                    />
                  ))}
              </div>
            )}
            <div>
              <Button
                icon="clipboard"
                text="Copy To Clipboard"
                intent="primary"
                fill
                minimal
                onClick={onCopyToClipboard}
              />
            </div>
          </React.Fragment>
        </Content>
      </Window>
    )}
  </Spring>
)

export default AppComponent
