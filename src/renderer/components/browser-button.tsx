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
  const urlId: string | undefined = useRecoilValue(urlIdSelector)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (urlId) {
        selectBrowser(urlId, browser.id, event.altKey)
      }
    },
    [browser.id, urlId],
  )

  const nameSizeClass = getNameSize(browser.name)

  return (
    <button
      key={browser.id}
      className={cc([
        'bg-grey-800 active:bg-grey-900',
        'border border-grey-900 focus:outline-none rounded shadow',
        'active:text-grey-200 text-left leading-none',
        'flex flex-col justify-between items-stretch',
        'p-3',
        'cursor-default',
        className,
      ])}
      onClick={handleClick}
      type="button"
    >
      <div className="flex justify-between items-center mb-2">
        <img alt={browser.name} className="w-8 h-8" src={browser.logo} />
        {browser.hotKey && (
          <kbd className="bg-grey-700 py-1 px-2 text-xs font-bold uppercase rounded">
            {browser.hotKey}
          </kbd>
        )}
      </div>
      <div className={cc(['font-bold', nameSizeClass])}>{browser.name}</div>
    </button>
  )
}

export default BrowserButton
