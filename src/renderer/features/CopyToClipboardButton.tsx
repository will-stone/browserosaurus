import './CopyToClipboardButton.css'

import { ipcRenderer } from 'electron'
import * as mousetrap from 'mousetrap'
import * as React from 'react'
import { COPY_TO_CLIPBOARD } from '../../config/events'

interface Props {
  transform: string
}

export const CopyToClipboardButton: React.FC<Props> = ({ transform }) => {
  React.useEffect(() => {
    mousetrap.bind(['command+c'], e => {
      e.preventDefault()
      ipcRenderer.send(COPY_TO_CLIPBOARD)
    })
  }, [])

  return (
    <div
      className="CopyToClipboardButton"
      style={{ transform }}
      onClick={() => ipcRenderer.send(COPY_TO_CLIPBOARD)}
    >
      <span style={{ marginBottom: '4px' }}>Copy to Clipboard</span>
      <span
        style={{
          padding: '1px 5px',
          fontSize: '11px',
          borderRadius: '5px',
          textTransform: 'uppercase',
          backgroundColor: '#0b0b0b',
        }}
      >
        ⌘+C
      </span>
    </div>
  )
}
