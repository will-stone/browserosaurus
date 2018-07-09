import React, { Fragment } from 'react'

const Kbd = ({ isDefault, hotKey }) => {
  return (
    <span style={{ marginLeft: 'auto' }}>
      {isDefault && (
        <Fragment>
          <kbd className="pt-key">enter</kbd>{' '}
          <span className="pt-text-muted">/</span>{' '}
        </Fragment>
      )}

      <kbd className="pt-key">{hotKey}</kbd>
    </span>
  )
}

export default Kbd
