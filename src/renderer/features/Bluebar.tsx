import './Bluebar.css'

import { ipcRenderer } from 'electron'
import * as React from 'react'
import { animated, useSpring } from 'react-spring'

import { COPY_TO_CLIPBOARD } from '../../config/events'
import useUrl from '../hooks/useUrl'

interface Props {
  isVisible: boolean
}

const onClick = (): void => ipcRenderer.send(COPY_TO_CLIPBOARD)

const Bluebar: React.FC<Props> = ({ isVisible }) => {
  const urlObj = useUrl()

  const springProps = useSpring({
    config: { tension: 500, friction: 26 },
    transform: `scaleY(${isVisible ? 1 : 0})`,
  })

  return (
    <animated.button
      className="Bluebar"
      onClick={onClick}
      style={springProps}
      type="button"
    >
      <span className="Bluebar__url">
        <span className="Bluebar__protocol">
          {urlObj.protocol && urlObj.protocol.includes('s') && (
            <svg
              aria-hidden="true"
              className="Bluebar__protocolIcon"
              focusable="false"
              role="img"
              viewBox="0 0 448 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zM264 392c0 22.1-17.9 40-40 40s-40-17.9-40-40v-48c0-22.1 17.9-40 40-40s40 17.9 40 40v48zm32-168H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"
                fill="currentColor"
              />
            </svg>
          )}
        </span>
        <span className="Bluebar__hostname">{urlObj.hostname}</span>
        <span className="Bluebar__urlPart">
          {urlObj.port && `:${urlObj.port}`}
        </span>
        <span className="Bluebar__urlPart">{urlObj.pathname}</span>
        <span className="Bluebar__urlPart">{urlObj.search}</span>
        <span className="Bluebar__urlPart">{urlObj.hash}</span>
      </span>
    </animated.button>
  )
}

export default Bluebar
