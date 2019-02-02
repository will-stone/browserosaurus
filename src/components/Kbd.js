import React from 'react'

const Kbd = ({ isDefault, hotKey }) => {
  return (
    <span style={{ marginLeft: 'auto' }}>
      {isDefault && (
        <React.Fragment>
          <kbd className="bp3-key">⏎</kbd>
          <span> / </span>
        </React.Fragment>
      )}
      <kbd className="bp3-key">{hotKey}</kbd>
    </span>
  )
}

export default Kbd
