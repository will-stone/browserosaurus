import { faStar } from '@fortawesome/pro-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cc from 'classcat'
import React, { useCallback } from 'react'
import { useRecoilValue } from 'recoil'

import { Browser } from '../../config/browsers'
import { getHotkeyByBrowserId } from '../../utils/getHotkeyByBrowserId'
import { selectBrowser } from '../sendToMain'
import { favBrowserIdAtom, hotkeysAtom, urlSelector } from '../state'
import { LargeDarkButton } from './button'
import Kbd from './kbd'

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

  return 'text-base'
}

interface Props {
  browser: Browser
}

const BrowserButton: React.FC<Props> = ({ browser }) => {
  const url = useRecoilValue(urlSelector)
  const favBrowserId = useRecoilValue(favBrowserIdAtom)
  const hotkeys = useRecoilValue(hotkeysAtom)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      selectBrowser(url, browser.id, event.altKey)
    },
    [browser.id, url],
  )

  const nameSizeClass = getNameSize(browser.name)
  const isFav = browser.id === favBrowserId
  const hotkey = getHotkeyByBrowserId(hotkeys, browser.id)

  return (
    <LargeDarkButton
      key={browser.id}
      className="flex flex-col justify-between items-stretch"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <img alt={browser.name} className="w-10 h-10" src={browser.logo} />
        <div className="flex flex-col items-end space-y-1">
          {isFav && (
            <Kbd className="space-x-1">
              <FontAwesomeIcon
                className="text-yellow-400 align-text-top"
                icon={faStar}
              />
              <span>space</span>
            </Kbd>
          )}
          {hotkey && <Kbd>{hotkey}</Kbd>}
        </div>
      </div>
      <div className={cc(['font-bold', nameSizeClass])}>{browser.name}</div>
    </LargeDarkButton>
  )
}

export default BrowserButton
