import { Spinner, Text } from '@blueprintjs/core'
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import EscapeToHide from '../utils/EscapeToHide'
import UrlListener from '../utils/UrlListener'
import WindowHeightUpdater from '../utils/WindowHeightUpdater'
import WithActivities from '../utils/WithActivities'
import Activity from './components/Activity.container'

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
                  <div>
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
                  </div>
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
