import cc from 'classcat'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { Browser } from '../../config/browsers'
import { browserClicked } from '../store/actions'

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
      className={cc([className])}
      onClick={handleClick}
      type="button"
    >
      <div>
        <img alt={browser.name} src={browser.logo} />
        {browser.hotKey && <kbd>{browser.hotKey}</kbd>}
      </div>
      <div>{browser.name}</div>
    </button>
  )
}

export default BrowserButton
