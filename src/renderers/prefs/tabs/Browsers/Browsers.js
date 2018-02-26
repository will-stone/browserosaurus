import { Button } from '@blueprintjs/core'
import React, { Fragment } from 'react'

import BrowserList from '../../modules/BrowserList'

import WindowHeightUpdater from '../../../utils/WindowHeightUpdater'

const Browsers = ({ browsers, state, onRescan }) => {
  return (
    <Fragment>
      <WindowHeightUpdater />

      <BrowserList browsers={browsers} />

      <p style={{ textAlign: 'center' }}>
        <Button
          onClick={onRescan}
          text="Rescan for browsers"
          loading={state === 'pending'}
          className="pt-minimal"
        />
      </p>
    </Fragment>
  )
}

export default Browsers
