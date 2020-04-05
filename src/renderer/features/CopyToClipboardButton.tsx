import './CopyToClipboardButton.css'

import { ipcRenderer } from 'electron'
import * as mousetrap from 'mousetrap'
import * as React from 'react'

import { COPY_TO_CLIPBOARD } from '../../config/events'

const onButtonClick = () => ipcRenderer.send(COPY_TO_CLIPBOARD)

const CopyToClipboardButton: React.FC = () => {
  React.useEffect(() => {
    mousetrap.bind(['command+c'], (evt) => {
      evt.preventDefault()
      ipcRenderer.send(COPY_TO_CLIPBOARD)
    })
  }, [])

  return (
    <button
      className="CopyToClipboardButton"
      onClick={onButtonClick}
      type="button"
    >
      <span className="CopyToClipboardButton__text">Copy to Clipboard</span>
      <span className="CopyToClipboardButton__hotkey">⌘+C</span>
    </button>
  )
}

export default CopyToClipboardButton
