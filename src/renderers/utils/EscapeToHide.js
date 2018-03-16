import { remote } from 'electron'
import mousetrap from 'mousetrap'
import { Component } from 'react'

class EscapeToHideContainer extends Component {
  componentDidMount() {
    this._bindEscHide()
  }

  _bindEscHide = () => {
    mousetrap.bind('esc', () => {
      // prevents a beep on escape
      setTimeout(() => {
        remote.app.hide()
      }, 0)
    })
  }

  render() {
    return this.props.children
  }
}

export default EscapeToHideContainer
