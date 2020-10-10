import { faBackspace } from '@fortawesome/free-solid-svg-icons/faBackspace'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createAction } from '@reduxjs/toolkit'
import clsx from 'clsx'
import { css } from 'emotion'
import React from 'react'
import { useDispatch } from 'react-redux'
import Url from 'url'

import { SPONSOR_URL } from '../../config/CONSTANTS'
import { copyUrl, hideWindow } from '../sendToMain'
import { useSelector } from '../store'
import { useTheme } from '../store/selector-hooks'
import { themes } from '../themes'
import Button from './atoms/button'
import MouseDiv from './molecules/mouse-div'

export const clickedSettingsButton = createAction(
  'urlBar/clickedSettingsButton',
)
export const clickedUrlBackspaceButton = createAction(
  'urlBar/clickedUrlBackspaceButton',
)
const clickedCopyButton = (url: string) => {
  if (url) {
    copyUrl(url)
    hideWindow()
  }
}

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
    <MouseDiv
      capture
      className={clsx(
        className,
        'flex-shrink-0',
        'w-full',
        'flex items-center space-x-4',
        'border-2 rounded-md shadow',
        'px-4',
        'h-12',
        css({
          backgroundColor: themes[theme].url.bg,
          borderColor: isSponsorUrl
            ? themes[theme].url.border.sponsor
            : themes[theme].url.border.base,
        }),
      )}
      style={{ minWidth: '300px' }}
    >
      <div
        className={clsx(
          'flex-grow',
          'text-xs tracking-wider',
          'flex items-center justify-between',
          'overflow-hidden',
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
          tip="Delete section of URL (Backspace)"
        >
          <FontAwesomeIcon fixedWidth icon={faBackspace} />
        </Button>

        <Button
          disabled={isEmpty}
          onClick={() => clickedCopyButton(url)}
          tip="Copy (<kbd>⌘+C</kbd>)"
        >
          <FontAwesomeIcon fixedWidth icon={faCopy} />
        </Button>

        <Button
          aria-label="Settings menu"
          onClick={() => dispatch(clickedSettingsButton())}
          tip="Settings"
          tone={updateStatus === 'downloaded' ? 'primary' : undefined}
        >
          <FontAwesomeIcon
            fixedWidth
            icon={faCog}
            spin={updateStatus === 'available'}
          />
        </Button>
      </div>
    </MouseDiv>
  )
}

export default UrlBar
