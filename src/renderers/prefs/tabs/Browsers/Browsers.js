import React, { Fragment } from 'react'

import Button from '../../../components/Button'

import BrowserList from '../../modules/BrowserList'

import WindowHeightUpdater from '../../../utils/WindowHeightUpdater'

const Browsers = ({ browsers, state, onRescan }) => {
  if (state === 'pending') {
    return (
      <Fragment>
        <WindowHeightUpdater />
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          Looking for browsers...
        </div>
      </Fragment>
    )
  } else {
    return (
      <Fragment>
        <WindowHeightUpdater />
        <BrowserList browsers={browsers} />
        <p style={{ textAlign: 'center' }}>
          <Button onClick={onRescan}>Rescan for browsers</Button>
        </p>
      </Fragment>
    )
  }
}

export default Browsers
