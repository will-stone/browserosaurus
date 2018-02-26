import React from 'react'

import UpdateStatus from '../../modules/UpdateStatus'

import WindowHeightUpdater from '../../../utils/WindowHeightUpdater'

const About = () => {
  return (
    <div style={{ textAlign: 'center', paddingBottom: '2rem' }}>
      <WindowHeightUpdater />
      <p>
        <img
          src="../../images/icon/icon.png"
          height="100"
          width="100"
          alt=""
          style={{ display: 'block', margin: '0 auto' }}
        />
      </p>
      <h1>Browserosaurus</h1>
      <p>
        <UpdateStatus />
      </p>
    </div>
  )
}

export default About
