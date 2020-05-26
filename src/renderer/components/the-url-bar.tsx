import cc from 'classcat'
import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { useRecoilValue } from 'recoil'
import Url from 'url'

import { UrlHistoryItem } from '../../main/stores'
import { urlItemSelector } from '../selectors'
import ProtocolIcon from './protocol-icon'

interface Props {
  className?: string
}

const TheUrlBar: React.FC<Props> = ({ className }) => {
  const urlItem: UrlHistoryItem | undefined = useRecoilValue(urlItemSelector)

  const parsedUrl = urlItem ? Url.parse(urlItem.url) : undefined

  return (
    <div
      className={cc([
        className,
        'flex-shrink-0 flex items-center justify-between',
        'text-xs text-grey-500 tracking-wider font-medium',
        'overflow-hidden space-x-2',
      ])}
    >
      {parsedUrl ? (
        <>
          <div className="overflow-hidden flex-grow">
            <SwitchTransition mode="out-in">
              <CSSTransition
                key={urlItem?.id}
                classNames="slide-in-fade-out"
                timeout={200}
              >
                <div className="flex items-center space-x-2 truncate">
                  <ProtocolIcon
                    className="flex-shrink-0"
                    urlProtocol={parsedUrl.protocol}
                  />
                  <div className="truncate">
                    <span className="font-bold text-grey-300 text-sm">
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
          </div>
          <button
            className={cc([
              'flex-shrink-0',
              'bg-grey-800',
              'py-2 px-3 space-x-2',
              'text-grey-300 font-bold active:text-white uppercase',
              'rounded focus:outline-none cursor-default',
            ])}
            type="button"
          >
            <span>Copy</span>
            <kbd className="opacity-50 tracking-widest">⌘+C</kbd>
          </button>
        </>
      ) : (
        <span>Most recently clicked link will show here</span>
      )}
    </div>
  )
}

export default TheUrlBar
