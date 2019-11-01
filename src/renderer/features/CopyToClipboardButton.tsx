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
      <span className="CopyToClipboardButton__text">Copy to Clipboard</span>
      <span className="CopyToClipboardButton__hotkey">⌘+C</span>
    </div>
  )
}
