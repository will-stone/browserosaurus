import React from 'react'
import ReactDOM from 'react-dom'

import App from '../components/App'

import WithBrowsers from '../utils/WithBrowsers'

ReactDOM.render(
  <App>
    <WithBrowsers>
      {browsers => {
        return 'moo'
        // return browsers.map(browser => browser.name)
      }}
    </WithBrowsers>
  </App>,
  document.getElementById('picker-root')
)
