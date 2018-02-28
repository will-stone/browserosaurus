import { remote } from 'electron'
import React from 'react'

class WindowHeightUpdater extends React.Component {
  _updateWindowHeight = () => {
    setTimeout(() => {
      const window = remote.getCurrentWindow()

      const height = Math.min(
        document.body.scrollHeight,
        document.body.clientHeight
      )
      const width = window.getSize()[0]
      window.setSize(width, height, true) // animate
    }, 0)

    return false
  }

  componentDidMount() {
    this._updateWindowHeight()
  }

  componentDidUpdate() {
    this._updateWindowHeight()
  }

  render() {
    return false
  }
}

export default WindowHeightUpdater
