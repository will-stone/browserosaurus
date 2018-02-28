import React, { Fragment } from 'react'

const BrowserLogo = ({ name }) => {
  return (
    <Fragment>
      <img
        src={`../../images/browser-logos/${name}.png`}
        alt=""
        style={{
          width: 32,
          height: 32,
          verticalAlign: 'middle',
          marginLeft: '1rem',
          marginRight: '1rem'
        }}
      />
      <span style={{ marginRight: 'auto' }}>{name}</span>
    </Fragment>
  )
}

export default BrowserLogo
