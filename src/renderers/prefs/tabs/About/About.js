import React from 'react'

import UpdateStatus from '../../modules/UpdateStatus'

const About = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <p>
        <img src="../../images/icon/icon.png" height="100" width="100" alt="" />
      </p>
      <h1>Browserosaurus</h1>
      <div />
      <p>
        <UpdateStatus />
      </p>
    </div>
  )
}

export default About
