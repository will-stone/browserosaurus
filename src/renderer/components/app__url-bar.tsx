import { faBackspace } from '@fortawesome/free-solid-svg-icons/faBackspace'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH'
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
        'flex items-center space-x-4',
        'bg-grey-800',
        'border-2 rounded-md shadow-lg',
        'px-4',
        'h-12',
        isSponsorUrl ? 'border-pink-500' : 'border-grey-800 ',
      )}
      style={{ minWidth: '300px' }}
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
            {parsedUrl.host || (
              <FontAwesomeIcon
                className="text-grey-600"
                fixedWidth
                icon={faEllipsisH}
              />
            )}
          </span>
          <span>
            {parsedUrl.pathname}
            {parsedUrl.search}
            {parsedUrl.hash}
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 space-x-2">
        <Button
          disabled={isEmpty}
          onClick={handleBackspaceButtonClick}
          title="Delete section of URL (Backspace)"
        >
          <FontAwesomeIcon fixedWidth icon={faBackspace} />
        </Button>

        <Button
          disabled={isEmpty}
          onClick={handleCopyClick}
          title="Copy to clipboard (⌘+C)"
        >
          <FontAwesomeIcon fixedWidth icon={faCopy} />
        </Button>

        <Button aria-label="Tiles Menu" onClick={handleTilesMenuButtonClick}>
          <FontAwesomeIcon fixedWidth icon={faCog} title="Tiles menu" />
        </Button>
      </div>
    </MouseDiv>
  )
}

export default UrlBar
