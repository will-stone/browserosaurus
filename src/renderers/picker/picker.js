import { Spinner, Text } from '@blueprintjs/core'
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import Activity from './Activity'

import EscapeToHide from '../utils/EscapeToHide'
import UrlListener from '../utils/UrlListener'
import WithBrowsers from '../utils/WithBrowsers'
import WindowHeightUpdater from '../utils/WindowHeightUpdater'

ReactDOM.render(
  <EscapeToHide>
    <UrlListener>
      {url => (
        <Fragment>
          <div style={{ padding: '1rem' }}>
            <Text ellipsize={true}>{url}</Text>
          </div>
          <WithBrowsers>
            {({ browsers, state }) => {
              return state === 'idle' || state === 'pending' ? (
                <div style={{ textAlign: 'center', paddingBottom: '1rem' }}>
                  <Spinner intent="primary" className="pt-small" />
                  <WindowHeightUpdater />
                </div>
              ) : (
                <Fragment>
                  {browsers
                    .filter(browser => browser.enabled)
                    .map((browser, index) => (
                      <Activity
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
  </EscapeToHide>,
  document.getElementById('picker-root')
)
