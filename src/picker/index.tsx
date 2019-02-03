import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.container'
import { FocusStyleManager } from '@blueprintjs/core'

FocusStyleManager.onlyShowFocusOnTabs()

ReactDOM.render(<App />, document.getElementById('picker-root'))
