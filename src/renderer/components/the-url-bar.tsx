import cc from 'classcat'
import React, { useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import Url from 'url'

import { openMenuSelector, urlItemSelector } from '../selectors'
import { copyUrl } from '../sendToMain'
import { DarkButton } from './button'
import Kbd from './kbd'
import ProtocolIcon from './protocol-icon'

interface Props {
  className?: string
}

const TheUrlBar: React.FC<Props> = ({ className }) => {
  const [openMenu, setOpenMenu] = useRecoilState(openMenuSelector)
  const urlItem = useRecoilValue(urlItemSelector)

  const parsedUrl = urlItem ? Url.parse(urlItem.url) : undefined

  const handleCopyClick = useCallback(() => {
    copyUrl(urlItem?.id)
  }, [urlItem?.id])

  const handleUrlHistoryOpenClick = useCallback(() => {
    setOpenMenu(openMenu === 'history' ? false : 'history')
  }, [openMenu, setOpenMenu])

  const isUpdateUrl = parsedUrl?.hostname === 'browserosaurus.com'

  return (
    <div
      className={cc([
        className,
        'flex items-center space-x-4',
        { 'opacity-50': !parsedUrl },
      ])}
    >
      <button
        className={cc([
          'flex-grow',
          'bg-grey-700',
          'rounded-full focus:outline-none',
          { border: !isUpdateUrl },
          { 'border-2': isUpdateUrl },
          { 'border-grey-900': !isUpdateUrl && openMenu !== 'history' },
          { 'border-grey-600': !isUpdateUrl && openMenu === 'history' },
          { 'border-blue-500': isUpdateUrl },
          'shadow-inner',
          'text-xs text-grey-500 tracking-wider font-medium',
          'h-10 pl-4 pr-2',
          'flex items-center justify-between',
          'overflow-hidden',
          { 'bg-grey-300 z-30': openMenu === 'history' },
          'cursor-default',
        ])}
        disabled={!parsedUrl}
        onClick={handleUrlHistoryOpenClick}
        type="button"
      >
        {parsedUrl ? (
          <div className="flex items-center space-x-2 truncate">
            <ProtocolIcon
              className="flex-shrink-0"
              urlProtocol={parsedUrl.protocol}
            />
            <div className="truncate">
              <span className="font-bold text-grey-200 text-sm">
                {parsedUrl.hostname}
              </span>
              <span>
                {parsedUrl.port && `:${parsedUrl.port}`}
                {parsedUrl.pathname}
                {parsedUrl.search}
                {parsedUrl.hash}
              </span>
            </div>
          </div>
        ) : (
          <span>Most recently clicked link will show here</span>
        )}

        <div
          className={cc([
            'flex-shrink-0',
            'flex items-center justify-center',
            'w-6 h-6',
            'border border-grey-900 rounded-full',
            { 'bg-grey-600 text-grey-300': openMenu !== 'history' },
            { 'bg-grey-300 text-grey-800': openMenu === 'history' },
          ])}
        >
          <svg
            aria-hidden="true"
            className={cc([
              'w-2 h-2 transform',
              { 'rotate-180': openMenu === 'history' },
            ])}
            focusable="false"
            role="img"
            viewBox="0 0 448 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
              fill="currentColor"
            />
          </svg>
        </div>
      </button>

      <DarkButton disabled={!parsedUrl} onClick={handleCopyClick}>
        <span>Copy</span>
        <Kbd>⌘+C</Kbd>
      </DarkButton>
    </div>
  )
}

export default TheUrlBar
