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
      style={{
        width: '100%',
        height: '40px',
        transform,
        position: 'relative',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0e0e0e',
        opacity: 0.4,
      }}
      onClick={() => ipcRenderer.send(COPY_TO_CLIPBOARD)}
    >
      Copy to Clipboard{' '}
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
