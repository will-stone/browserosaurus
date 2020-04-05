import './Picker.css'

import { ipcRenderer } from 'electron'
import * as React from 'react'

import browserLogos from '../../config/browserLogos'
import { browsers } from '../../config/browsers'
import { BROWSER_RUN } from '../../config/events'
import useBrowsers from '../hooks/useBrowsers'
import useOpt from '../hooks/useOpt'
import CopyToClipboardButton from './CopyToClipboardButton'

// const numberOfRowsAndCols = (num: number): [number, number] => {
//   const breakpoint = 4
//   if (num <= breakpoint) {
//     return [1, num]
//   }

//   const sqrt = Math.sqrt(num)
//   const ceil = Math.ceil(sqrt)
//   const floor = Math.floor(sqrt)
//   const ceilByFloor = ceil * floor
//   return ceilByFloor < num ? [ceil, ceil] : [floor, ceil]
// }

const Picker: React.FC = () => {
  const browserNames = useBrowsers()
  const isOptHeld = useOpt()

  return (
    <div className="Picker" data-testid="picker-window">
      <div className="Picker__inner">
        {browserNames.map((name, index) => {
          const browser = browsers[name]
          const isFav = index === 0

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
              ipcRenderer.send(BROWSER_RUN, name)
            }
          }

          return (
            <button
              key={name}
              className="Picker__browser-btn"
              data-testid="browser-button"
              onClick={onBrowserClick}
              type="button"
            >
              <img
                alt={name}
                className="Picker__browser-img"
                src={browserLogos[name]}
              />
              {browserKey && (
                <div className="Picker__browser-key">{browserKey}</div>
              )}
            </button>
          )
        })}
        <CopyToClipboardButton />
      </div>
    </div>
  )
}

export default Picker
