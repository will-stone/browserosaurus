import { faBackspace } from '@fortawesome/free-solid-svg-icons/faBackspace'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { css } from 'emotion'
import React from 'react'
import ReactTooltip from 'react-tooltip'
import Url from 'url'

import { SPONSOR_URL } from '../../config/CONSTANTS'
import { events, useStore } from '../store'
import { themes } from '../themes'
import Button from './atoms/button'
import MouseDiv from './organisms/mouse-div'

const {
  clickedCopyButton,
  clickedSettingsButton,
  clickedUrlBackspaceButton,
} = events

interface Props {
  className?: string
}

const UrlBar: React.FC<Props> = ({ className }) => {
  const url = useStore((state) => state.ui.url)
  const updateStatus = useStore((state) => state.ui.updateStatus)
  const theme = useStore((state) => state.mainStore.theme)

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
          data-for="backspace"
          data-tip
          disabled={isEmpty}
          onClick={clickedUrlBackspaceButton}
        >
          <FontAwesomeIcon fixedWidth icon={faBackspace} />
          {!isEmpty && (
            <ReactTooltip
              backgroundColor={themes[theme].tooltip.bg}
              delayShow={500}
              effect="solid"
              id="backspace"
              place="bottom"
            >
              <span className={css({ color: themes[theme].tooltip.text })}>
                Delete section of URL (Backspace)
              </span>
            </ReactTooltip>
          )}
        </Button>

        <Button
          data-for="copy-to-clipboard"
          data-tip
          disabled={isEmpty}
          onClick={clickedCopyButton}
        >
          <FontAwesomeIcon fixedWidth icon={faCopy} />
          <ReactTooltip
            backgroundColor={themes[theme].tooltip.bg}
            delayShow={500}
            effect="solid"
            id="copy-to-clipboard"
            place="bottom"
          >
            <span className={css({ color: themes[theme].tooltip.text })}>
              Copy (<kbd>⌘+C</kbd>)
            </span>
          </ReactTooltip>
        </Button>

        <Button
          aria-label="Settings menu"
          data-for="settings"
          data-tip
          onClick={clickedSettingsButton}
          tone={updateStatus === 'downloaded' ? 'primary' : undefined}
        >
          <FontAwesomeIcon
            fixedWidth
            icon={faCog}
            spin={updateStatus === 'available'}
          />
          <ReactTooltip
            backgroundColor={themes[theme].tooltip.bg}
            delayShow={500}
            effect="solid"
            id="settings"
            place="bottom"
          >
            <span className={css({ color: themes[theme].tooltip.text })}>
              Settings
            </span>
          </ReactTooltip>
        </Button>
      </div>
    </MouseDiv>
  )
}

export default UrlBar
