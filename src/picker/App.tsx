import * as React from 'react'
import { Spring } from 'react-spring'
import styled from 'styled-components'
import { EAppState, IActivity } from '../model'

const Window = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 4vh;
`

const Url = styled.div`
  background-color: black;
  border-radius: 20px;
  color: #fafafa;
  font-size: 3vh;
  line-height: 1.5;
  margin-bottom: 4vh;
  padding: 1vh 4vh;
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
`

const ActivityButton = styled.button`
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 1rem;
  background: transparent;
  border: none;
  opacity: 0.5;
  transition: opacity 300ms linear;
  text-align: center;

  &:hover {
    opacity: 1;
  }
`

const AppComponent = ({
  activities,
  isVisible,
  onActivityClick,
  onCopyToClipboard,
  onWindowAnimationEnd,
  onWindowClick,
  state,
  url,
}: {
  activities: IActivity[]
  isVisible: boolean
  onActivityClick: (act: IActivity) => void
  onCopyToClipboard: () => void
  onWindowAnimationEnd: () => void
  onWindowClick: () => void
  state: EAppState
  url: string | null
}) => (
  <Spring to={{ opacity: isVisible ? 1 : 0 }} onRest={onWindowAnimationEnd}>
    {windowSpringStyles => (
      <Window style={windowSpringStyles} onClick={onWindowClick}>
        <Url>
          {url}
          <CopyButton onClick={onCopyToClipboard}>Copy To Clipboard</CopyButton>
        </Url>
        <div>
          {state === EAppState.IDLE || state === EAppState.PENDING ? (
            <div style={{ textAlign: 'center' }}>Loading...</div>
          ) : (
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              {activities
                .sort((a, b) => (a.fav ? -1 : b.fav ? 1 : 0))
                .map(activity => (
                  <Spring
                    key={activity.name}
                    to={{
                      transform: `scale(${isVisible ? 1 : 0})`,
                      transformOrigin: 'center center',
                    }}
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
                          marginLeft: activity.fav ? 'auto' : '7.5%',
                          marginRight: activity.fav ? 'auto' : '7.5%',
                          width: activity.fav ? '20%' : '10%',
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
                      </ActivityButton>
                    )}
                  </Spring>
                ))}
            </div>
          )}
        </div>
      </Window>
    )}
  </Spring>
)

export default AppComponent
