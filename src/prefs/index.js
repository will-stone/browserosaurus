import { FocusStyleManager } from '@blueprintjs/core'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app/app.component'

FocusStyleManager.onlyShowFocusOnTabs()

ReactDOM.render(<App />, document.getElementById('prefs-root'))
