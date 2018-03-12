import { Spinner, Text, Button } from '@blueprintjs/core'
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import {clipboard} from 'electron'

import App from './modules/App'
import Link from './modules/Link'

import UrlListener from '../utils/UrlListener'
import WithBrowsers from '../utils/WithBrowsers'
import WindowHeightUpdater from '../utils/WindowHeightUpdater'

ReactDOM.render(
  <App>
    <UrlListener>
      {url => (
        <Fragment>

          <div style={{ padding: '1rem 1rem 1rem 0', display: 'flex', alignItems:'center' }}>
            <Button style={{
              width: 32,
              height: 32,
              verticalAlign: 'middle',
              marginLeft: '1rem',
              marginRight: '1rem'
            }} onClick={() => clipboard.writeText(url)}>&#128203;</Button>
            <Text ellipsize={true} title={url}>{url}</Text>
          </div>

          <WithBrowsers>
            {({ browsers, state }) => {
              return state === 'idle' || state === 'pending' ? (
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
              )
            }}
          </WithBrowsers>
        </Fragment>
      )}
    </UrlListener>
  </App>,
  document.getElementById('picker-root')
)
