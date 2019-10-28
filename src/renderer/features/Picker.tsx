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
import { useOpt } from '../hooks/useOpt'
import { CopyToClipboardButton } from './CopyToClipboardButton'

const rowsAndCols = (num: number) => {
  const sqrt = Math.sqrt(num)
  const ceil = Math.ceil(sqrt)
  const floor = Math.floor(sqrt)
  const ceilByFloor = ceil * floor
  return ceilByFloor < num ? [ceil, ceil] : [floor, ceil]
}

interface Props {
  x: number
  y: number
  isVisible: boolean
}

export const Picker: React.FC<Props> = ({ x, y, isVisible }) => {
  const activityNames = useActivities()
  const isOptHeld = useOpt()

  const [rows, cols] = rowsAndCols(activityNames.length)

  const width = cols * 100

  const height = rows * 100 + 40

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
        {activityNames.map((name, i) => {
          const act = activities[name]
          const isFav = i === 0
          const actKey =
            isFav && act.hotKey
              ? `${act.hotKey} / space`
              : isFav
              ? 'space'
              : act.hotKey || undefined
          return (
            <ActivityButton
              key={name}
              onClick={e => {
                e.stopPropagation()
                if ((isOptHeld && act.optCmd) || !isOptHeld) {
                  ipcRenderer.send(ACTIVITY_RUN, name)
                }
              }}
              float={activityFloat}
              transform={activityTransform}
              opacity={isOptHeld && !act.optCmd ? 0.5 : 1}
            >
              <ActivityImg src={act.logo} alt={name} />
              {actKey && <ActivityKey>{actKey}</ActivityKey>}
            </ActivityButton>
          )
        })}
        <CopyToClipboardButton transform={pickerWindowInnerTransform} />
      </Div>
    </Card>
  )
}
