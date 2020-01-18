import './index.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './App'
import ErrorBoundary from './ErrorBoundary'

ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.querySelector('#picker-root'),
)
