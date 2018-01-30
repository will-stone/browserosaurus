import { css } from 'emotion'
import React from 'react'

import updateWindowHeight from '../../shared/updateWindowHeight'

class About extends React.Component {
  componentDidMount() {
    updateWindowHeight()
  }

  render() {
    return (
      <div
        className={css`
          text-align: center;
        `}
      >
        <p>
          <img src="../images/icon/icon.png" height="100" width="100" alt="" />
        </p>
        <h1>Browserosaurus</h1>
        <div />
        <p>Checking for update...</p>
      </div>
    )
  }
}

export default About
