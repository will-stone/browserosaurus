import { faBackspace } from '@fortawesome/free-solid-svg-icons/faBackspace'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt'
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
  clickedQuitButton,
  clickedSetAsDefaultBrowserButton,
  clickedSettingsButton,
  clickedUrlBackspaceButton,
  clickedVersionButton,
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
  const isDefaultProtocolClient = useSelector(
    (state) => state.ui.isDefaultProtocolClient,
  )
  const version = useSelector((state) => state.ui.version)

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
          'flex items-center justify-between',
          'overflow-hidden',
          'pr-1',
          'text-sm tracking-wider',
        )}
      >
        {editMode && (
          <Button
            aria-label="Version"
            onClick={() => dispatch(clickedVersionButton())}
          >
            {version}
          </Button>
        )}

        {!isDefaultProtocolClient && editMode && (
          <Button
            aria-label="Set as default browser"
            onClick={() => () => dispatch(clickedSetAsDefaultBrowserButton())}
          >
            Set As Default Browser
          </Button>
        )}

        {!editMode && (
          <div
            className={clsx(
              'text-sm tracking-wider',
              css({ color: theme.secondaryLabel }),
            )}
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
        )}
      </div>

      <div className="flex-shrink-0 space-x-2">
        {editMode && (
          <Button
            aria-label="Quit"
            onClick={() => dispatch(clickedQuitButton())}
            title="Quit"
          >
            <FontAwesomeIcon fixedWidth icon={faSignOutAlt} />
          </Button>
        )}

        {!editMode && (
          <Button
            disabled={isEmpty}
            onClick={() => dispatch(clickedUrlBackspaceButton())}
            title="Delete section of URL (Backspace)"
          >
            <FontAwesomeIcon fixedWidth icon={faBackspace} />
          </Button>
        )}

        {!editMode && (
          <Button
            disabled={isEmpty}
            onClick={() => dispatch(clickedCopyButton(url))}
            title="Copy (⌘+C)"
          >
            <FontAwesomeIcon fixedWidth icon={faCopy} />
          </Button>
        )}

        {editMode ? (
          <Button
            aria-label="Close menu"
            onClick={() => dispatch(clickedCloseMenuButton())}
            title="Close menu (escape)"
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
