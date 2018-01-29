import React, { Fragment } from 'react'

import logo from '../../images/icon/logo.png'

const About = () => {
  return (
    <Fragment>
      <p>
        <img src={logo} height="100" width="100" alt="" />
      </p>
      <h1>Browserosaurus</h1>
      <div />
      <p>Checking for update...</p>
    </Fragment>
  )
}

export default About
