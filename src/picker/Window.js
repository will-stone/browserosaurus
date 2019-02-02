import { remote } from 'electron'
import React from 'react'

class Window extends React.Component {
  ref = React.createRef()

  componentDidMount() {
    const observer = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const width = Math.floor(entry.contentRect.width)
        const height = Math.floor(entry.contentRect.height)
        remote.getCurrentWindow().setSize(width, height, false) // do not animate
      })
    })
    observer.observe(this.ref.current)
  }

  render() {
    const { children, style, ...rest } = this.props

    return (
      <div ref={this.ref} style={{ backgroundColor: '#21252b', ...style }} {...rest}>
        {children}
      </div>
    )
  }
}

export default Window
