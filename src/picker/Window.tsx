import { remote } from 'electron'
import * as React from 'react'

declare var ResizeObserver: any

class Window extends React.Component<{ style: React.CSSProperties }> {
  public ref = React.createRef<HTMLDivElement>()

  public componentDidMount() {
    const observer = new ResizeObserver((entries: any) => {
      entries.forEach((entry: any) => {
        const width = Math.floor(entry.contentRect.width)
        const height = Math.floor(entry.contentRect.height)
        remote.getCurrentWindow().setSize(width, height, false) // do not animate
      })
    })
    observer.observe(this.ref.current)
  }

  public render() {
    const { children, style, ...rest } = this.props

    return (
      <div
        ref={this.ref}
        style={{ background: 'linear-gradient(to bottom, #3a8044 0%, #1a4040 100%)', ...style }}
        {...rest}
      >
        <div
          style={{
            backgroundImage: 'url(../images/skin.png)',
            backgroundSize: 'cover',
            bottom: 0,
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: -1,
          }}
        />
        <div
          style={{
            background: 'black',
            bottom: 0,
            left: 0,
            opacity: 0.8,
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: -1,
          }}
        />
        <div
          style={{
            border: '5px solid black',
            bottom: 0,
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: -1,
          }}
        />
        {children}
      </div>
    )
  }
}

export default Window
