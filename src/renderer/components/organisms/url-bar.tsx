import { faBackspace } from '@fortawesome/free-solid-svg-icons/faBackspace'
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
  clickedUrlBackspaceButton,
} from '../../store/actions'
import Button from '../atoms/button'

interface Props {
  className?: string
}

const UrlBar: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch()
  const url = useSelector((state) => state.ui.url)
  const theme = useSelector((state) => state.theme)

  const isEmpty = url.length === 0
  const parsedUrl = Url.parse(url)

  return (
    <div
      className={clsx(
        className,
        'flex-shrink-0',
        'w-full p-4',
        'flex items-center space-x-4',
        'bg-black bg-opacity-25',
        css({
          color: theme.windowFrameText,
        }),
      )}
    >
      <div
        className={clsx(
          'flex-grow h-full',
          'text-xs tracking-wider',
          'flex items-center justify-between',
          'overflow-hidden',
          'draggable',
          'pr-1',
          css({ color: theme.secondaryLabel }),
        )}
      >
        <div className="truncate">
          <span>{parsedUrl.protocol}</span>
          {parsedUrl.slashes && '//'}
          <span className={clsx('text-base', css({ color: theme.label }))}>
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
      </div>
    </div>
  )
}

export default UrlBar
