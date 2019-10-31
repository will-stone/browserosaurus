import { ipcRenderer } from 'electron'
import * as React from 'react'

import { LOG } from '../config/events'

export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error | null, errorInfo: object) {
    ipcRenderer.send(LOG, {
      errorName: error && error.name,
      errorMessage: error && error.message,
      errorInfo,
    })
  }

  render() {
    return this.props.children
  }
}
