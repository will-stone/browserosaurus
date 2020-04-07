import cc from 'classcat'
import React, { useCallback } from 'react'

import { Browser } from '../../config/browsers'
import { runBrowser } from '../sendToMain'
import styles from './BrowserButton.module.css'

interface Props {
  browser: Browser
  className?: string
}

const BrowserButton: React.FC<Props> = ({ browser, className }) => {
  const handleClick = useCallback(() => runBrowser(browser.id), [browser.id])

  return (
    <button
      key={browser.id}
      className={cc([styles.button, className])}
      onClick={handleClick}
      type="button"
    >
      <div className={styles.top}>
        <img alt={browser.name} className={styles.logo} src={browser.logo} />
        {browser.hotKey && <kbd className={styles.kbd}>{browser.hotKey}</kbd>}
      </div>
      <div
        className={cc([
          styles.title,
          { [styles.titleIsLong]: browser.name.length > 10 },
        ])}
      >
        {browser.name}
      </div>
    </button>
  )
}

export default BrowserButton
