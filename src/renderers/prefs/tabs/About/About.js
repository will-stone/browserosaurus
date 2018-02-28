import { remote, shell } from 'electron'
import React from 'react'

import UpdateStatus from '../../modules/UpdateStatus'

const About = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <p>
        <img
          src="../../images/icon/icon.png"
          height="100"
          width="100"
          alt=""
          style={{ display: 'block', margin: '0 auto' }}
          onClick={() =>
            shell.openExternal('https://will-stone.github.io/browserosaurus/')
          }
        />
      </p>
      <h1>Browserosaurus</h1>
      <h3 style={{ marginBottom: '1rem' }}>v{remote.app.getVersion()}</h3>
      <p>
        <UpdateStatus />
      </p>
    </div>
  )
}

export default About
