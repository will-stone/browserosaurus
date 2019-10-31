import './Picker.css'

import cc from 'classcat'
import { ipcRenderer } from 'electron'
import * as React from 'react'

import { activities } from '../../config/activities'
import { ACTIVITY_RUN } from '../../config/events'
import { useActivities } from '../hooks/useActivities'
import { useOpt } from '../hooks/useOpt'
import { CopyToClipboardButton } from './CopyToClipboardButton'

const numberOfRowsAndCols = (num: number) => {
  if (num <= 4) {
    return [1, num]
  }
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

  const [rows, cols] = numberOfRowsAndCols(activityNames.length)

  // Picker dimensions
  const width = cols * 100
  const height = rows * 100 + 50

  // Picker releative-to-mouse placement
  const [isAtRight, isAtBottom] = [
    x > window.innerWidth - width,
    y > window.innerHeight - height,
  ]

  // Picker's inline styles
  const [left, top] = [
    isAtRight ? x - width - 1 : x + 1,
    isAtBottom ? y - height : y,
  ]
  const transformOrigin = `${isAtRight ? 'right' : 'left'} ${
    isAtBottom ? 'bottom' : 'top'
  }`
  const opacity = isVisible ? 1 : 0
  const transform = `scale(${isVisible ? 1 : 0})`

  // Y-Orientation
  const rotateAll =
    (isAtRight && isAtBottom) || isAtBottom ? 'rotate(180deg)' : 'rotate(0deg)'
  const rotateOffset =
    (isAtRight && isAtBottom) || isAtBottom ? 'rotate(180deg)' : 'rotate(0deg)'

  // X-orientation
  const activityFloat =
    (isAtRight && !isAtBottom) || (isAtBottom && !isAtRight) ? 'right' : 'left'

  return (
    <div
      className="Picker"
      style={{ top, left, width, height, transformOrigin, transform, opacity }}
      data-testid="picker-window"
    >
      <div className="Picker__inner" style={{ transform: rotateAll }}>
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
            <button
              key={name}
              className={cc([
                'Picker__browser-btn',
                { 'Picker__browser-btn--no-opt': isOptHeld && !act.optCmd },
              ])}
              role="button"
              onClick={e => {
                e.stopPropagation()
                if ((isOptHeld && act.optCmd) || !isOptHeld) {
                  ipcRenderer.send(ACTIVITY_RUN, name)
                }
              }}
              style={{
                float: activityFloat,
                transform: rotateOffset,
              }}
            >
              <img className="Picker__browser-img" src={act.logo} alt={name} />
              {actKey && <div className="Picker__browser-key">{actKey}</div>}
            </button>
          )
        })}
        <CopyToClipboardButton transform={rotateAll} />
      </div>
    </div>
  )
}
