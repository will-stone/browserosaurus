import './Bluebar.css'

import { ipcRenderer } from 'electron'
import * as React from 'react'

import { COPY_TO_CLIPBOARD } from '../../config/events'
import { useUrl } from '../hooks/useUrl'

interface Props {
  isVisible: boolean
}

export const Bluebar: React.FC<Props> = ({ isVisible }) => {
  const u = useUrl()

  const transform = isVisible ? 'scaleY(1)' : 'scaleY(0)'

  const onClick = (): void => ipcRenderer.send(COPY_TO_CLIPBOARD)

  return (
    <button
      type="button"
      className="Bluebar"
      style={{ transform }}
      onClick={onClick}
    >
      <span className="Bluebar__url">
        <span className="Bluebar__protocol">
          {u.protocol && u.protocol.includes('s') && (
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="Bluebar__protocolIcon"
            >
              <path
                fill="currentColor"
                d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zM264 392c0 22.1-17.9 40-40 40s-40-17.9-40-40v-48c0-22.1 17.9-40 40-40s40 17.9 40 40v48zm32-168H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"
              />
            </svg>
          )}
        </span>
        <span className="Bluebar__hostname">{u.hostname}</span>
        <span className="Bluebar__urlPart">{u.port && `:${u.port}`}</span>
        <span className="Bluebar__urlPart">{u.pathname}</span>
        <span className="Bluebar__urlPart">{u.search}</span>
        <span className="Bluebar__urlPart">{u.hash}</span>
      </span>
    </button>
  )
}
