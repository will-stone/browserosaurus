import { remote } from 'electron'
import mousetrap from 'mousetrap'
import { Component } from 'react'

class AppContainer extends Component {
  componentDidMount() {
    this._bindEscHide()
  }

  _bindEscHide = () => {
    mousetrap.bind('esc', () => {
      setTimeout(() => {
        // prevents a beep on escape
        remote.getCurrentWindow().hide()
      }, 0)
    })
  }

  render() {
    return this.props.children
  }
}

export default AppContainer
