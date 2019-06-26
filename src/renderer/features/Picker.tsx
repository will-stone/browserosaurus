import { ipcRenderer } from 'electron'
import * as React from 'react'
import { ACTIVITY_RUN } from '../../config/events'
import { ActivityButton } from '../atoms/ActivityButton'
import { ActivityImg } from '../atoms/ActivityImg'
import { ActivityKey } from '../atoms/ActivityKey'
import { Card } from '../atoms/Card'
import { Div } from '../atoms/Div'
import { useActivities } from '../hooks/useActivities'
import { activities } from '../../config/activities'

interface Props {
  x: number
  y: number
  isVisible: boolean
}

export const Picker: React.FC<Props> = ({ x, y, isVisible }) => {
  const [activityNames, favName] = useActivities()

  const numOfNonFavActs = activityNames.length
  const fAdjust = favName ? 1 : 0

  const width = 200 * fAdjust + Math.min(numOfNonFavActs, 3 - fAdjust) * 100

  const height =
    200 * fAdjust + (Math.ceil(numOfNonFavActs / (3 + fAdjust)) - fAdjust) * 100

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
        {favName && (
          <ActivityButton
            onClick={e => {
              e.stopPropagation()
              ipcRenderer.send(ACTIVITY_RUN, favName)
            }}
            size={200}
            float={activityFloat}
            transform={activityTransform}
          >
            <ActivityImg src={activities[favName].logo} alt={favName} />
            <ActivityKey>
              {activities[favName].hotKey && activities[favName].hotKey + ' / '}
              enter
            </ActivityKey>
          </ActivityButton>
        )}
        {activityNames.map(name => {
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
      </Div>
    </Card>
  )
}
