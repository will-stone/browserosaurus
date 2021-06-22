import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'
import Url from 'url'

import { CARROT_URL } from '../../../../config/CONSTANTS'
import {
  clickedCopyButton,
  clickedUpdateAvailableButton,
  clickedUrlBackspaceButton,
} from '../../../../shared/state/actions'
import { useSelector } from '../../../../shared/state/hooks'
import Button from '../../../shared/components/atoms/button'
import {
  BackspaceIcon,
  ClipboardCopyIcon,
} from '../../../shared/components/atoms/icons'

interface Props {
  className?: string
}

const UrlBar: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch()
  const url = useSelector((state) => state.data.url)
  const isUpdateAvailable = useSelector(
    (state) => state.data.updateStatus === 'available',
  )

  const isEmpty = url.length === 0
  const parsedUrl = Url.parse(url)

  return (
    <div
      className={clsx(
        className,
        'flex-shrink-0',
        'w-full px-4',
        'flex items-center space-x-4',
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
          className="tracking-wider text-opacity-50 dark:text-opacity-50 text-black dark:text-white"
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
          <span className="text-opacity-100 dark:text-opacity-100 text-black dark:text-white">
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

      <div className="flex-shrink-0 space-y-2 flex flex-col items-center justify-center">
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

        <Button
          className={clsx('text-xs', !isUpdateAvailable && 'hidden')}
          onClick={() => dispatch(clickedUpdateAvailableButton())}
        >
          Update Available
        </Button>
      </div>
    </div>
  )
}

export default UrlBar
