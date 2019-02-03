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
      <div ref={this.ref} style={{ backgroundColor: '#21252b', ...style }} {...rest}>
        {children}
      </div>
    )
  }
}

export default Window
