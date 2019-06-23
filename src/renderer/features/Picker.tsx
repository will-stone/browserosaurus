import { ipcRenderer } from 'electron'
import * as React from 'react'
import { ACTIVITY_RUN } from '../../config/events'
import { ActivityButton } from '../atoms/ActivityButton'
import { ActivityImg } from '../atoms/ActivityImg'
import { ActivityKey } from '../atoms/ActivityKey'
import { Card } from '../atoms/Card'
import { Div } from '../atoms/Div'
import { useActivities } from '../hooks/useActivities'
import { logos } from '../../config/activities'

interface Props {
  x: number
  y: number
  isVisible: boolean
}

export const Picker: React.FC<Props> = ({ x, y, isVisible }) => {
  const [activities, favActivity] = useActivities()
  const numOfActs = Object.keys(activities).length

  const width = favActivity
    ? 200 + Math.min(numOfActs, 2) * 100
    : Math.min(numOfActs, 3) * 100

  const height = favActivity
    ? 200 + (Math.ceil(numOfActs / 4) - 1) * 100
    : Math.ceil(numOfActs / 3) * 100

  const [isAtRight, isAtBottom] = [
    x > window.innerWidth - width,
    y > window.innerHeight - height,
  ]

  const [left, top] = [
    isAtRight ? x - width - 1 : x + 1,
    isAtBottom ? y - height : y,
  ]

  const transformOrigin = `${isAtRight ? 'right' : 'left'} ${
    isAtBottom ? 'bottom' : 'top'
  }`

  const pickerWindowInnerTransform =
    (isAtRight && isAtBottom) || isAtBottom ? 'rotate(180deg)' : 'rotate(0deg)'

  const activityFloat =
    (isAtRight && !isAtBottom) || (isAtBottom && !isAtRight) ? 'right' : 'left'

  const activityTransform =
    (isAtRight && isAtBottom) || isAtBottom ? 'rotate(180deg)' : 'rotate(0deg)'

  return (
    <Card
      top={top}
      left={left}
      width={width}
      height={height}
      transformOrigin={transformOrigin}
      transform={`scale(${isVisible ? 1 : 0})`}
      opacity={isVisible ? 1 : 0}
      data-testid="picker-window"
    >
      <Div
        position="relative"
        height="100%"
        width="100%"
        transform={pickerWindowInnerTransform}
      >
        {favActivity && (
          <ActivityButton
            onClick={e => {
              e.stopPropagation()
              ipcRenderer.send(ACTIVITY_RUN, favActivity.name)
            }}
            size={200}
            float={activityFloat}
            transform={activityTransform}
          >
            <ActivityImg src={logos[favActivity.name]} alt={favActivity.name} />
            <ActivityKey>
              {favActivity.hotKey && favActivity.hotKey + ' / '}
              enter
            </ActivityKey>
          </ActivityButton>
        )}
        <div>
          {Object.keys(activities).map(name => {
            const act = activities[name]
            return (
              <ActivityButton
                key={name}
                onClick={e => {
                  e.stopPropagation()
                  ipcRenderer.send(ACTIVITY_RUN, name)
                }}
                float={activityFloat}
                transform={activityTransform}
              >
                <ActivityImg src={act.logo} alt={name} />
                {act.hotKey && <ActivityKey>{act.hotKey}</ActivityKey>}
              </ActivityButton>
            )
          })}
        </div>
      </Div>
    </Card>
  )
}
