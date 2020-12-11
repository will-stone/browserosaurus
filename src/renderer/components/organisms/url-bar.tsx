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

import { SPONSOR_URL } from '../../../config/CONSTANTS'
import { useSelector } from '../../store'
import {
  clickedCopyButton,
  clickedSettingsButton,
  clickedUrlBackspaceButton,
} from '../../store/actions'
import { useTheme } from '../../store/selector-hooks'
import { themes } from '../../themes'
import Button from '../atoms/button'

interface Props {
  className?: string
}

const UrlBar: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch()
  const url = useSelector((state) => state.ui.url)
  const updateStatus = useSelector((state) => state.ui.updateStatus)
  const theme = useTheme()

  const isSponsorUrl = url === SPONSOR_URL
  const isEmpty = url.length === 0
  const parsedUrl = Url.parse(url)

  return (
    <div
      className={clsx(
        className,
        'flex-shrink-0',
        'w-full',
        'flex items-center space-x-4',
        'pl-20 pr-1',
        css({ backgroundColor: themes[theme].titleBarBg }),
      )}
      style={{ height: '39px' }}
    >
      <div
        className={clsx(
          'flex-grow',
          'text-xs tracking-wider',
          'flex items-center justify-between',
          'overflow-hidden',
          'draggable',
          css({
            color: isSponsorUrl
              ? themes[theme].url.text.sponsorBase
              : themes[theme].url.text.base,
          }),
        )}
      >
        <div className="truncate">
          <span>{parsedUrl.protocol}</span>
          {parsedUrl.slashes && '//'}
          <span
            className={clsx(
              'text-base',
              css({
                color: isSponsorUrl
                  ? themes[theme].url.text.sponsorHost
                  : themes[theme].url.text.host,
              }),
            )}
          >
            {parsedUrl.host || (
              <FontAwesomeIcon
                className={css({
                  color: themes[theme].url.text.disabled,
                })}
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
          tone={updateStatus === 'downloaded' ? 'primary' : undefined}
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
