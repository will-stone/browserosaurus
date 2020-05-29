import cc from 'classcat'
import React, { useCallback } from 'react'
import { useRecoilValue } from 'recoil'

import { Browser } from '../../config/browsers'
import { urlIdSelector } from '../selectors'
import { selectBrowser } from '../sendToMain'

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
  const urlId = useRecoilValue(urlIdSelector)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      selectBrowser(urlId, browser.id, event.altKey)
    },
    [browser.id, urlId],
  )

  const nameSizeClass = getNameSize(browser.name)

  return (
    <button
      key={browser.id}
      className={cc([
        'h-24',
        'bg-grey-700',
        'border border-grey-900 focus:outline-none rounded shadow-md active:shadow-none',
        'active:text-grey-200 text-left leading-none',
        'flex flex-col justify-between items-stretch',
        'p-3',
        'cursor-default',
        className,
      ])}
      onClick={handleClick}
      type="button"
    >
      <div className="flex justify-between items-start">
        <img alt={browser.name} className="w-10 h-10" src={browser.logo} />
        {browser.hotKey && (
          <kbd className="bg-grey-600 py-1 px-2 text-xs font-bold uppercase rounded border border-grey-900">
            {browser.hotKey}
          </kbd>
        )}
      </div>
      <div className={cc(['font-bold', nameSizeClass])}>{browser.name}</div>
    </button>
  )
}

export default BrowserButton
