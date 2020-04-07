import './BrowserButton.css'

import cc from 'classcat'
import React, { useCallback } from 'react'

import { Browser } from '../../config/browsers'
import { runBrowser } from '../sendToMain'

interface Props {
  browser: Browser
  className?: string
}

const BrowserButton: React.FC<Props> = ({ browser, className }) => {
  const handleClick = useCallback(() => runBrowser(browser.id), [browser.id])

  return (
    <button
      key={browser.id}
      className={cc(['browserButton', className])}
      onClick={handleClick}
      type="button"
    >
      <div className="browserButton__top">
        <img
          alt={browser.name}
          className="browserButton__logo"
          src={browser.logo}
        />
        {browser.hotKey && (
          <kbd className="browserButton__kbd">{browser.hotKey}</kbd>
        )}
      </div>
      <div
        className={cc([
          'browserButton__title',
          { 'browserButton__title--isLong': browser.name.length > 10 },
        ])}
      >
        {browser.name}
      </div>
    </button>
  )
}

export default BrowserButton
