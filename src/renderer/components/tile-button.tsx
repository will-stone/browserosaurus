import { faStar } from '@fortawesome/pro-solid-svg-icons/faStar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cc from 'classcat'
import React, { useCallback } from 'react'

import { logos } from '../../config/logos'
import { App } from '../../config/types'
import { getHotkeyByAppId } from '../../utils/getHotkeyByAppId'
import { openApp } from '../sendToMain'
import { useSelector, useShallowEqualSelector } from '../store'
import { LargeDarkButton } from './button'
import Kbd from './kbd'

/**
 * Determines Tailwind text class given an app name of given length.
 * @param name app name
 */
const getNameSize = (name: string): string => {
  const numberWords = name.split(' ').length

  if (numberWords >= 3 || name.length > 10) {
    return 'text-xs'
  }

  return 'text-sm'
}

interface Props {
  app: App
}

const TileButton: React.FC<Props> = ({ app }) => {
  const url = useSelector((state) => state.ui.url)
  const favAppId = useSelector((state) => state.mainStore.fav)
  const hotkeys = useShallowEqualSelector((state) => state.mainStore.hotkeys)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      openApp({ url, appId: app.id, isAlt: event.altKey })
    },
    [app.id, url],
  )

  const nameSizeClass = getNameSize(app.name)
  const isFav = app.id === favAppId
  const hotkey = getHotkeyByAppId(hotkeys, app.id)

  return (
    <LargeDarkButton
      key={app.id}
      aria-label={`${app.name} Tile`}
      className="flex flex-col justify-between items-stretch"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <img alt={app.name} className="w-10 h-10" src={logos[app.id]} />
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
      <div className={cc(['font-bold', nameSizeClass])}>{app.name}</div>
    </LargeDarkButton>
  )
}

export default TileButton
