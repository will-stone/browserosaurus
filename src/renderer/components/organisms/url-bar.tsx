import { faBackspace } from '@fortawesome/free-solid-svg-icons/faBackspace'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { css } from 'emotion'
import React from 'react'
import { useDispatch } from 'react-redux'
import Url from 'url'

import { useSelector } from '../../store'
import {
  clickedCloseMenuButton,
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
  const theme = useSelector((state) => state.theme)
  const editMode = useSelector((state) => state.ui.editMode)

  const isEmpty = url.length === 0
  const parsedUrl = Url.parse(url)

  return (
    <div
      className={clsx(
        className,
        'flex-shrink-0',
        'w-full px-4',
        'flex items-center space-x-4',
        'bg-black bg-opacity-10',
        css({
          color: theme.windowFrameText,
          height: '74px',
        }),
      )}
    >
      <div
        className={clsx(
          'flex-grow h-full',
          'text-sm tracking-wider',
          'flex items-center justify-between',
          'overflow-hidden',
          'draggable',
          'pr-1',
          css({ color: theme.secondaryLabel }),
        )}
      >
        <div
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            overflowWrap: 'break-word',
            wordBreak: 'break-all',
            textOverflow: 'ellipsis',
          }}
        >
          <span>{parsedUrl.protocol}</span>
          {parsedUrl.slashes && '//'}
          <span className={clsx(css({ color: theme.label }))}>
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

        {editMode ? (
          <Button
            aria-label="Close menu"
            onClick={() => dispatch(clickedCloseMenuButton())}
            title="Close menu"
          >
            <FontAwesomeIcon fixedWidth icon={faTimes} />
          </Button>
        ) : (
          <Button
            aria-label="Settings menu"
            onClick={() => dispatch(clickedSettingsButton())}
            title="Settings"
          >
            <FontAwesomeIcon fixedWidth icon={faCog} />
          </Button>
        )}
      </div>
    </div>
  )
}

export default UrlBar
