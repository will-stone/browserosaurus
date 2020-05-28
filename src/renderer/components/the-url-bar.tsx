import cc from 'classcat'
import React, { useCallback } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { useRecoilValue } from 'recoil'
import Url from 'url'

import { UrlHistoryItem } from '../../main/stores'
import { urlItemSelector } from '../selectors'
import { copyUrl } from '../sendToMain'
import ProtocolIcon from './protocol-icon'

interface Props {
  className?: string
}

const TheUrlBar: React.FC<Props> = ({ className }) => {
  const urlItem: UrlHistoryItem | undefined = useRecoilValue(urlItemSelector)

  const parsedUrl = urlItem ? Url.parse(urlItem.url) : undefined

  const handleCopyClick = useCallback(() => {
    copyUrl(urlItem?.id)
  }, [urlItem?.id])

  return (
    <div className={cc([className, 'flex items-center space-x-4'])}>
      <div
        className={cc([
          'flex-grow',
          'bg-grey-800',
          'rounded-full',
          'shadow-inner',
          'text-xs text-grey-500 tracking-wider font-medium',
          'h-10 px-4',
          'flex items-center',
          'overflow-hidden',
        ])}
      >
        {parsedUrl ? (
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={urlItem?.id}
              classNames="url-bar-anim"
              timeout={{
                appear: 0,
                enter: 150,
                exit: 150,
              }}
            >
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
            </CSSTransition>
          </SwitchTransition>
        ) : (
          <span className="text-grey-500">
            Most recently clicked link will show here
          </span>
        )}
      </div>

      <button
        className={cc([
          'bg-grey-700',
          'border border-grey-900 rounded shadow-md active:shadow-none focus:outline-none',
          'text-xs active:text-grey-200 font-bold',
          'py-1 px-2 space-x-2',
          'cursor-default',
        ])}
        onClick={handleCopyClick}
        type="button"
      >
        <span>Copy</span>
        <kbd className="opacity-50 tracking-widest">⌘+C</kbd>
      </button>
    </div>
  )
}

export default TheUrlBar
