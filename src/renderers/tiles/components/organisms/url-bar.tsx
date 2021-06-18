import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'
import Url from 'url'

import { CARROT_URL } from '../../../../config/CONSTANTS'
import {
  clickedCopyButton,
  clickedUrlBackspaceButton,
} from '../../../../shared-state/actions'
import { useSelector } from '../../../../shared-state/hooks'
import Button from '../atoms/button'
import { BackspaceIcon, ClipboardCopyIcon } from '../atoms/icons'

interface Props {
  className?: string
}

const UrlBar: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch()
  const url = useSelector((state) => state.data.url)
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

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
      )}
      style={{ height: '74px' }}
    >
      <div
        className={clsx(
          'flex-grow h-full',
          'flex items-center justify-between',
          'overflow-hidden',
          'pr-1',
          'tracking-wider',
        )}
      >
        <div
          className={clsx(
            'tracking-wider text-opacity-50',
            isDarkMode ? 'text-white' : 'text-black',
          )}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            overflowWrap: 'break-word',
            wordBreak: 'break-all',
            textOverflow: 'ellipsis',
          }}
        >
          {url === CARROT_URL && (
            <div>
              <span aria-label="Coffee emoji" role="img">
                ☕️
              </span>{' '}
              Choose a browser to open URL:
            </div>
          )}
          <span>{parsedUrl.protocol}</span>
          <span>{parsedUrl.slashes && '//'}</span>
          <span
            className={clsx(
              'text-opacity-100',
              isDarkMode ? 'text-white' : 'text-black',
            )}
          >
            {parsedUrl.host || (
              <span className="opacity-30">Browserosaurus</span>
            )}
          </span>
          <span>
            {parsedUrl.pathname}
            {parsedUrl.search}
            {parsedUrl.hash}
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 space-x-2 flex items-center">
        <Button
          disabled={isEmpty}
          onClick={() => dispatch(clickedUrlBackspaceButton())}
          title="Delete section of URL (Backspace)"
        >
          <BackspaceIcon className="h-5 w-5" />
        </Button>

        <Button
          disabled={isEmpty}
          onClick={() => dispatch(clickedCopyButton(url))}
          title="Copy (⌘+C)"
        >
          <ClipboardCopyIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export default UrlBar
