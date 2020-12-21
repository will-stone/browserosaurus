import { faBackspace } from '@fortawesome/free-solid-svg-icons/faBackspace'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { css } from 'emotion'
import React from 'react'
import { useDispatch } from 'react-redux'
import Url from 'url'

import { useSelector } from '../../store'
import {
  clickedCopyButton,
  clickedSettingsButton,
  clickedUrlBackspaceButton,
} from '../../store/actions'
import Button from '../atoms/button'

interface Props {
  className?: string
}

const UrlBar: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch()
  const url = useSelector((state) => state.ui.url)
  const updateStatus = useSelector((state) => state.ui.updateStatus)
  const theme = useSelector((state) => state.theme)

  const isEmpty = url.length === 0
  const parsedUrl = Url.parse(url)

  return (
    <div
      className={clsx(
        className,
        'flex-shrink-0',
        'w-full',
        'flex items-center space-x-4',
        css({ backgroundColor: theme.controlBackground }),
      )}
      style={{ height: '39px' }}
    >
      <div
        className={clsx(
          'flex-grow h-full',
          'text-xs tracking-wider',
          'flex items-center justify-between',
          'overflow-hidden',
          'draggable',
          'pl-4 pr-1',
        )}
      >
        <div className="truncate">
          <span>{parsedUrl.protocol}</span>
          {parsedUrl.slashes && '//'}
          <span className={clsx('text-base')}>
            {parsedUrl.host || (
              <FontAwesomeIcon fixedWidth icon={faEllipsisH} />
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
          onClick={() => dispatch(clickedUrlBackspaceButton())}
          title="Delete section of URL (Backspace)"
        >
          <FontAwesomeIcon fixedWidth icon={faBackspace} />
        </Button>

        <Button
          disabled={isEmpty}
          onClick={() => dispatch(clickedCopyButton(url))}
          title="Copy (<kbd>⌘+C</kbd>)"
        >
          <FontAwesomeIcon fixedWidth icon={faCopy} />
        </Button>

        <Button
          aria-label="Settings menu"
          onClick={() => dispatch(clickedSettingsButton())}
          title="Settings"
        >
          <FontAwesomeIcon
            fixedWidth
            icon={faCog}
            spin={updateStatus === 'available'}
          />
        </Button>
      </div>
    </div>
  )
}

export default UrlBar
