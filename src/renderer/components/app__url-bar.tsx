import { faBackspace } from '@fortawesome/free-solid-svg-icons/faBackspace'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import ReactTooltip from 'react-tooltip'
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
  const updateStatus = useSelector((state) => state.ui.updateStatus)

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
        'w-full',
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
          data-for="backspace"
          data-tip
          disabled={isEmpty}
          onClick={handleBackspaceButtonClick}
        >
          <FontAwesomeIcon fixedWidth icon={faBackspace} />
          <ReactTooltip
            backgroundColor="#0D1117"
            delayShow={500}
            effect="solid"
            id="backspace"
            place="bottom"
          >
            <span className="font-bold text-grey-200">
              Delete section of URL (Backspace)
            </span>
          </ReactTooltip>
        </Button>

        <Button
          data-for="copy-to-clipboard"
          data-tip
          disabled={isEmpty}
          onClick={handleCopyClick}
        >
          <FontAwesomeIcon fixedWidth icon={faCopy} />
          <ReactTooltip
            backgroundColor="#0D1117"
            delayShow={500}
            effect="solid"
            id="copy-to-clipboard"
            place="bottom"
          >
            <span className="font-bold text-grey-200">
              Copy (<kbd>⌘+C</kbd>)
            </span>
          </ReactTooltip>
        </Button>

        <Button
          aria-label="Settings menu"
          data-for="settings"
          data-tip
          onClick={handleTilesMenuButtonClick}
          tone={updateStatus === 'downloaded' ? 'primary' : undefined}
        >
          <FontAwesomeIcon fixedWidth icon={faCog} />
          <ReactTooltip
            backgroundColor="#0D1117"
            delayShow={500}
            effect="solid"
            id="settings"
            place="bottom"
          >
            <span className="font-bold text-grey-200">Settings</span>
          </ReactTooltip>
        </Button>
      </div>
    </MouseDiv>
  )
}

export default UrlBar
