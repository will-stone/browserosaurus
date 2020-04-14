import cc from 'classcat'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { Browser } from '../../config/browsers'
import { browserClicked } from '../store/actions'
import styles from './BrowserButton.module.css'

interface Props {
  browser: Browser
  className?: string
}

const BrowserButton: React.FC<Props> = ({ browser, className }) => {
  const dispatch = useDispatch()

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      dispatch(browserClicked({ id: browser.id, isAlt: event.altKey }))
    },
    [browser.id, dispatch],
  )

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
