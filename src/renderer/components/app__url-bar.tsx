import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faGripHorizontal } from '@fortawesome/free-solid-svg-icons/faGripHorizontal'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import Url from 'url'

import { SPONSOR_URL } from '../../config/CONSTANTS'
import { copyUrl } from '../sendToMain'
import { useSelector } from '../store'
import {
  clickedTilesMenuButton,
  clickedUrlBackspaceButton,
} from '../store/actions'
import Button from './atoms/button'
import MouseDiv from './organisms/mouse-div'

interface Props {
  className?: string
}

const UrlBar: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch()
  const url = useSelector((state) => state.ui.url)
  const openMenu = useSelector((state) => state.ui.menu)

  const handleCopyClick = useCallback(() => {
    copyUrl(url)
  }, [url])

  const handleBackspaceButtonClick = useCallback(() => {
    dispatch(clickedUrlBackspaceButton())
  }, [dispatch])

  const handleTilesMenuButtonClick = useCallback(() => {
    dispatch(clickedTilesMenuButton())
  }, [dispatch])

  const isSponsorUrl = url === SPONSOR_URL
  const isEmpty = url.length === 0
  const parsedUrl = Url.parse(url)

  return (
    <MouseDiv
      capture
      className={clsx(
        className,
        'flex-shrink-0',
        'max-w-full',
        'flex items-center space-x-2',
        'bg-grey-800',
        'border-2 rounded-md shadow-lg',
        'px-2',
        'h-12',
        isSponsorUrl ? 'border-pink-500' : 'border-grey-800 ',
      )}
    >
      <div
        className={clsx(
          'flex-grow',
          isSponsorUrl ? 'text-pink-200' : 'text-grey-400 ',
          'text-xs tracking-wider font-bold',
          'flex items-center justify-between',
          'overflow-hidden',
        )}
      >
        <div className="truncate">
          <span>{parsedUrl.protocol}</span>
          {parsedUrl.slashes && '//'}
          <span
            className={clsx(
              'text-base',
              isSponsorUrl ? 'text-pink-400' : 'text-grey-200',
            )}
          >
            {parsedUrl.host}
          </span>
          <span>
            {parsedUrl.pathname}
            {parsedUrl.search}
            {parsedUrl.hash}
          </span>
        </div>
      </div>

      <Button
        disabled={isEmpty}
        onClick={handleBackspaceButtonClick}
        title="Delete section of URL (Backspace)"
      >
        ⌫
      </Button>

      <Button
        className="space-x-2"
        disabled={isEmpty}
        onClick={handleCopyClick}
        title="Copy to clipboard (⌘+C)"
      >
        <FontAwesomeIcon fixedWidth icon={faCopy} />
      </Button>

      <Button
        aria-label="Tiles Menu"
        className={clsx(openMenu === 'tiles' && 'z-20')}
        onClick={handleTilesMenuButtonClick}
        size="xxs"
      >
        {openMenu === 'tiles' ? (
          <FontAwesomeIcon fixedWidth icon={faTimes} title="Close menu" />
        ) : (
          <FontAwesomeIcon
            fixedWidth
            icon={faGripHorizontal}
            title="Tiles menu"
          />
        )}
      </Button>
    </MouseDiv>
  )
}

export default UrlBar
