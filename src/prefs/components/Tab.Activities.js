import { Button } from '@blueprintjs/core'
import React, { Fragment } from 'react'
import WindowHeightUpdater from '../../utils/WindowHeightUpdater'
import ActivitiesList from './ActivitiesList.container'

const Activities = ({ activities, state, onRescan }) => {
  return (
    <Fragment>
      <WindowHeightUpdater />

      <ActivitiesList activities={activities} />

      <p style={{ textAlign: 'center' }}>
        <Button
          onClick={onRescan}
          text="Rescan apps"
          loading={state === 'pending'}
          className="pt-minimal"
          intent="primary"
        />
      </p>
    </Fragment>
  )
}

export default Activities
