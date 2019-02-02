import { remote } from 'electron'
import { css } from 'emotion'
import React, { Component } from 'react'

class Window extends Component {
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
    const { children, ...rest } = this.props

    return (
      <div
        ref={this.ref}
        className={css`
          background-color: #21252b;
        `}
        {...rest}
      >
        {children}
      </div>
    )
  }
}

export default Window
