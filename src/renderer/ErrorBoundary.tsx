import { ipcRenderer } from 'electron'
import * as React from 'react'

import { LOG } from '../config/events'

class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error | null, errorInfo: object) {
    ipcRenderer.send(LOG, {
      errorName: error?.name,
      errorMessage: error?.message,
      errorInfo,
    })
  }

  render() {
    const { children } = this.props
    return children
  }
}

export default ErrorBoundary
