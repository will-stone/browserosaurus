import './Picker.css'

import { ipcRenderer } from 'electron'
import * as React from 'react'

import browserLogos from '../../config/browserLogos'
import { browsers } from '../../config/browsers'
import { BROWSER_RUN } from '../../config/events'
import useBrowsers from '../hooks/useBrowsers'
import useOpt from '../hooks/useOpt'
import CopyToClipboardButton from './CopyToClipboardButton'

const numberOfRowsAndCols = (num: number): [number, number] => {
  const breakpoint = 4
  if (num <= breakpoint) {
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
}

const Picker: React.FC<Props> = ({ x, y }) => {
  const browserProfiles = useBrowsers()
  const isOptHeld = useOpt()

  const [rows, cols] = numberOfRowsAndCols(browserProfiles.length)

  // Picker dimensions
  const tileWidth = 100
  const copyBarHeight = 50
  const width = cols * tileWidth + 2
  const height = rows * tileWidth + copyBarHeight + 2

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

  // Y-Orientation
  const rotateAll =
    (isAtRight && isAtBottom) || isAtBottom ? 'rotate(180deg)' : 'rotate(0deg)'
  const rotateOffset =
    (isAtRight && isAtBottom) || isAtBottom ? 'rotate(180deg)' : 'rotate(0deg)'

  // X-orientation
  const browserFloat =
    (isAtRight && !isAtBottom) || (isAtBottom && !isAtRight) ? 'right' : 'left'

  return (
    <div
      className="Picker"
      data-testid="picker-window"
      style={{
        top,
        left,
        width,
        height,
      }}
    >
      <div className="Picker__inner" style={{ transform: rotateAll }}>
        {browserProfiles.map((profile, index) => {
          const name = profile.browserName
          const browser = browsers[name]
          const isFav = index === 0
          const label = name + (profile.profile ? ` (${profile.profile})` : '')

          let browserKey = ''
          if (isFav && browser.hotKey) {
            browserKey = `${browser.hotKey} / space`
          } else if (isFav) {
            browserKey = 'space'
          } else if (browser.hotKey) {
            browserKey = browser.hotKey
          }

          const onBrowserClick = (
            evt: React.MouseEvent<HTMLButtonElement, MouseEvent>,
          ) => {
            evt.stopPropagation()
            if (isOptHeld || !isOptHeld) {
              ipcRenderer.send(BROWSER_RUN, profile)
            }
          }

          return (
            <button
              key={label}
              className="Picker__browser-btn"
              data-testid="browser-button"
              onClick={onBrowserClick}
              style={{
                float: browserFloat,
                transform: rotateOffset,
              }}
              type="button"
            >
              <img
                alt={label}
                className="Picker__browser-img"
                src={browserLogos[name]}
              />
              {browserKey && (
                <div className="Picker__browser-key">{browserKey}</div>
              )}
            </button>
          )
        })}
        <CopyToClipboardButton transform={rotateAll} />
      </div>
    </div>
  )
}

export default Picker
