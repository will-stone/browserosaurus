import React from 'react'

import WindowHeightUpdater from '../../../utils/WindowHeightUpdater'

const BrowserList = ({ browsers }) => {
  return (
    <div>
      {browsers && browsers.map(browser => browser.name)}
      <WindowHeightUpdater />
    </div>
  )
}

export default BrowserList
