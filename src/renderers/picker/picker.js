import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import App from '../components/App'

import WithBrowsers from '../utils/WithBrowsers'

import BrowserList from './modules/BrowserList'
import UrlListener from '../utils/UrlListener'

ReactDOM.render(
  <App>
    <UrlListener>
      {url => (
        <Fragment>
          <div>{url}</div>
          <WithBrowsers>
            {browsers => {
              return <BrowserList browsers={browsers} />
            }}
          </WithBrowsers>
        </Fragment>
      )}
    </UrlListener>
  </App>,
  document.getElementById('picker-root')
)
