import { Spinner, Text } from '@blueprintjs/core'
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import App from './modules/App'
import Link from './modules/Link'

import UrlListener from '../utils/UrlListener'
import WithBrowsers from '../utils/WithBrowsers'
import WindowHeightUpdater from '../utils/WindowHeightUpdater'

ReactDOM.render(
  <App>
    <WithBrowsers>
      {({ browsers, state }) => (
      <UrlListener
        defaultBrowser={browsers.filter(browser => browser.enabled)[0] || null}
      >
        {url => (
          <Fragment>
            <div style={{ padding: '1rem' }}>
              <Text ellipsize={true}>{url}</Text>
            </div>
              {(state === 'idle' || state === 'pending') ? (
                <div style={{ textAlign: 'center' }}>
                  <Spinner intent="primary" className="pt-small" />
                </div>
              ) : (
                <Fragment>
                  {browsers
                    .filter(browser => browser.enabled)
                    .map((browser, index) => (
                      <Link
                        key={browser.name}
                        browser={browser}
                        url={url}
                        defaultBrowser={index === 0}
                      />
                    ))}
                  <WindowHeightUpdater />
                </Fragment>
              )}
          </Fragment>
        )}
      </UrlListener>
      )}
    </WithBrowsers>
  </App>,
  document.getElementById('picker-root')
)
