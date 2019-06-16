import * as React from 'react'
import { Card } from '../atoms/Card'
import { Div } from '../atoms/Div'
import { ActivityButton } from '../atoms/ActivityButton'
import { ActivityImg } from '../atoms/ActivityImg'
import { ActivityKey } from '../atoms/ActivityKey'
import { Activity } from '../../model'
import { ACTIVITY_RUN } from '../../config/events'
import { ipcRenderer } from 'electron'

const { useMemo } = React

interface Props {
  activities: Activity[]
  fav: string | null
  x: number
  y: number
  isVisible: boolean
}

export const Picker: React.FC<Props> = ({
  activities,
  fav,
  x,
  y,
  isVisible,
}) => {
  const favActivity = useMemo(() => activities.find(act => act.name === fav), [
    activities,
    fav,
  ])

  const notFavActivities = useMemo(
    () => activities.filter(act => act.name !== fav),
    [activities, fav],
  )

  const [width, height] = useMemo(() => {
    const hasFavouriteSet = !!favActivity
    if (hasFavouriteSet) {
      const width = 200 + Math.min(notFavActivities.length, 2) * 100
      const height = 200 + (Math.ceil(notFavActivities.length / 4) - 1) * 100
      return [width, height]
    }

    const width = Math.min(notFavActivities.length, 3) * 100
    const height = Math.ceil(notFavActivities.length / 3) * 100
    return [width, height]
  }, [favActivity, notFavActivities.length])

  const [isAtRight, isAtBottom] = useMemo(
    () => [x > window.innerWidth - width, y > window.innerHeight - height],
    [height, x, y, width],
  )

  const [left, top] = useMemo(
    () => [isAtRight ? x - width - 1 : x + 1, isAtBottom ? y - height : y],
    [height, isAtBottom, isAtRight, x, y, width],
  )

  const transformOrigin = useMemo(
    () => `${isAtRight ? 'right' : 'left'} ${isAtBottom ? 'bottom' : 'top'}`,
    [isAtBottom, isAtRight],
  )

  const pickerWindowInnerTransform = useMemo(
    () =>
      (isAtRight && isAtBottom) || isAtBottom
        ? 'rotate(180deg)'
        : 'rotate(0deg)',
    [isAtBottom, isAtRight],
  )

  const activityFloat = useMemo(
    () =>
      (isAtRight && !isAtBottom) || (isAtBottom && !isAtRight)
        ? 'right'
        : 'left',
    [isAtBottom, isAtRight],
  )

  const activityTransform = useMemo(
    () =>
      (isAtRight && isAtBottom) || isAtBottom
        ? 'rotate(180deg)'
        : 'rotate(0deg)',
    [isAtBottom, isAtRight],
  )

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
            <ActivityImg src={favActivity.logo} alt={favActivity.name} />
            <ActivityKey>
              {favActivity.hotKey && favActivity.hotKey + ' / '}enter
            </ActivityKey>
          </ActivityButton>
        )}
        <div>
          {notFavActivities.map(activity => (
            <ActivityButton
              key={activity.name}
              onClick={e => {
                e.stopPropagation()
                ipcRenderer.send(ACTIVITY_RUN, activity.name)
              }}
              float={activityFloat}
              transform={activityTransform}
            >
              <ActivityImg src={activity.logo} alt={activity.name} />
              {activity.hotKey && <ActivityKey>{activity.hotKey}</ActivityKey>}
            </ActivityButton>
          ))}
        </div>
      </Div>
    </Card>
  )
}
