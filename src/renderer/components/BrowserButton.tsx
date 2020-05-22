import cc from 'classcat'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { Browser } from '../../config/browsers'
import { browserClicked } from '../store/actions'

/**
 * Determines Tailwind text class given a browser name of given length.
 * @param name browser name
 */
const getNameSize = (name: string): string => {
  const numberWords = name.split(' ').length

  if (numberWords >= 3) {
    return 'text-xs'
  }

  if (numberWords === 2) {
    return 'text-sm'
  }

  if (name.length > 10) {
    return 'text-sm'
  }

  if (name.length > 7) {
    return 'text-base'
  }

  return 'text-lg'
}

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

  const nameSizeClass = getNameSize(browser.name)

  return (
    <button
      key={browser.id}
      className={cc([
        'bg-grey-700 p-4 flex flex-col justify-between items-stretch text-left rounded focus:outline-none',
        className,
      ])}
      onClick={handleClick}
      type="button"
    >
      <div className="flex justify-between items-center mb-4">
        <img alt={browser.name} className="w-8 h-8" src={browser.logo} />
        {browser.hotKey && (
          <kbd className="bg-grey-800 text-grey-300 px-2 text-xs font-bold uppercase rounded">
            {browser.hotKey}
          </kbd>
        )}
      </div>
      <div className={cc(['font-bold text-grey-300', nameSizeClass])}>
        {browser.name}
      </div>
    </button>
  )
}

export default BrowserButton
