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
        'bg-grey-600',
        'border border-grey-900 rounded-full',
        'text-xs text-grey-300 tracking-wider font-medium',
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
  )
}

export default TheUrlBar
