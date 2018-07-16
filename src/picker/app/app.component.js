import { Spinner, Text } from '@blueprintjs/core'
import React from 'react'
import { Spring } from 'react-spring'
import Content from '../../components/Content'
import TitleBar from '../../components/TitleBar'
import Window from '../../components/Window'
import WithActivities from '../../utils/WithActivities'
import Activity from './activity/activity.container'

class AppComponent extends React.Component {
  render() {
    const { isVisible, onActivityClick, onSpringRest, url } = this.props

    return (
      <Spring
        to={{
          opacity: isVisible ? 1.5 : 0,
          transform: `scale(${isVisible ? 1 : 0})`,
          transformOrigin: '0 0',
        }}
        onRest={onSpringRest}
      >
        {styles => (
          <Window style={styles}>
            <TitleBar>
              <Text ellipsize={true}>{url}</Text>
            </TitleBar>
            <Content>
              <WithActivities>
                {({ activities, state }) => {
                  return state === 'idle' || state === 'pending' ? (
                    <div
                      style={{
                        textAlign: 'center',
                        paddingBottom: '1rem',
                      }}
                    >
                      <Spinner intent="primary" className="bp3-small" />
                    </div>
                  ) : (
                    <div>
                      {activities
                        .filter(activity => activity.enabled)
                        .map((activity, index) => (
                          <Activity
                            key={activity.name}
                            activity={activity}
                            defaultActivity={index === 0}
                            onClick={onActivityClick}
                            isAppVisible={isVisible}
                            url={url}
                          />
                        ))}
                    </div>
                  )
                }}
              </WithActivities>
            </Content>
          </Window>
        )}
      </Spring>
    )
  }
}

export default AppComponent
