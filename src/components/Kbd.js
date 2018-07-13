import React, { Fragment } from 'react'

const Kbd = ({ isDefault, hotKey }) => {
  return (
    <span style={{ marginLeft: 'auto' }}>
      {isDefault && (
        <Fragment>
          <kbd className="bp3-key">enter</kbd>{' '}
          <span className="bp3-text-muted">/</span>{' '}
        </Fragment>
      )}

      <kbd className="bp3-key">{hotKey}</kbd>
    </span>
  )
}

export default Kbd
