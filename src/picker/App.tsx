import * as React from 'react'
import { config, Spring } from 'react-spring'
import styled from 'styled-components'
import { EAppState, Activity } from '../model'

const Window = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 100px;
`

const Url = styled.div`
  color: #fafafa;
  font-size: 20px;
  line-height: 1.5;
  margin-top: 30px;
  padding: 20px 30px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  font-family: sans-serif;
`

const CopyButton = styled.button`
  background-color: transparent;
  border: none;
  color: white;
  
  &:focus {
    outline: none;
  }
`

const ActivityButton = styled.button`
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 30px;
  background: transparent;
  border: none;
  opacity: 0.5;
  transition: opacity 300ms linear;
  text-align: center;
  flex-shrink: 0;
  position: relative;

  &:hover {
    opacity: 1;
  }

  &:focus {
    outline: none;
  }
`

const Key = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  text-align: center;
  color: white;
  font-size: 18px;
  font-weight: 400;
`

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
}) => (
  <Spring to={{ opacity: isVisible ? 1 : 0 }} onRest={onWindowAnimationEnd} config={config.stiff}>
    {windowSpringStyles => (
      <Window style={windowSpringStyles} onClick={onWindowClick}>
        <div>
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
        </div>
        <Url>{url}</Url>
        <CopyButton onClick={onCopyToClipboard}>Copy To Clipboard</CopyButton>
      </Window>
    )}
  </Spring>
)

export default App
