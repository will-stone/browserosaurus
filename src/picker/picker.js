import { Spinner, Text } from '@blueprintjs/core'
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import Activity from './components/Activity.container'

import EscapeToHide from '../utils/EscapeToHide'
import UrlListener from '../utils/UrlListener'
import WithActivities from '../utils/WithActivities'
import WindowHeightUpdater from '../utils/WindowHeightUpdater'

ReactDOM.render(
  <EscapeToHide>
    <UrlListener>
      {url => (
        <Fragment>
          <div style={{ padding: '1rem' }}>
            <Text ellipsize={true}>{url}</Text>
          </div>
          <WithActivities>
            {({ activities, state }) => {
              return state === 'idle' || state === 'pending' ? (
                <div style={{ textAlign: 'center', paddingBottom: '1rem' }}>
                  <Spinner intent="primary" className="pt-small" />
                  <WindowHeightUpdater />
                </div>
              ) : (
                <Fragment>
                  {activities
                    .filter(activity => activity.enabled)
                    .map((activity, index) => (
                      <Activity
                        key={activity.name}
                        activity={activity}
                        url={url}
                        defaultActivity={index === 0}
                      />
                    ))}
                  <WindowHeightUpdater />
                </Fragment>
              )
            }}
          </WithActivities>
        </Fragment>
      )}
    </UrlListener>
  </EscapeToHide>,
  document.getElementById('picker-root')
)
