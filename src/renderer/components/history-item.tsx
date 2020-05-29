import cc from 'classcat'
import React, { useCallback, useEffect, useRef } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import TimeAgo from 'timeago-react'
import Url from 'url'

import { UrlHistoryItem } from '../../main/store'
import { urlIdSelector } from '../selectors'
import ProtocolIcon from './protocol-icon'

interface Props {
  isStriped: boolean
  item: UrlHistoryItem
}

const HistoryItem: React.FC<Props> = ({ isStriped, item }) => {
  const urlId: string | undefined = useRecoilValue(urlIdSelector)
  const setUrlId = useSetRecoilState(urlIdSelector)

  const url = Url.parse(item.url)
  const urlEnding = [url.pathname, url.search, url.hash].join('')

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault()
      setUrlId(item.id)
    },
    [setUrlId, item.id],
  )

  const isActive = urlId === item.id

  /**
   * Scroll active item into view
   */

  // eslint-disable-next-line unicorn/no-null
  const reference = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isActive) {
      reference.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [isActive])

  return (
    <button
      ref={reference}
      className={cc([
        'w-full',
        'p-3 rounded',
        'text-left text-xs text-grey-500 tracking-wider font-medium',
        'focus:outline-none cursor-default',
        { 'bg-grey-700': isStriped },
      ])}
      onClick={handleClick}
      type="button"
    >
      <div className="grid gap-4" style={{ gridTemplateColumns: 'auto 120px' }}>
        <div className="overflow-hidden flex items-center space-x-2">
          <ProtocolIcon className="flex-shrink-0" urlProtocol={url.protocol} />
          <span className="truncate">
            <span className="font-bold text-sm text-grey-300">
              {url.hostname}
            </span>
            <span>
              {url.port && `:${url.port}`}
              {urlEnding}
            </span>
          </span>
        </div>
        <TimeAgo
          className="flex items-center text-xs text-grey-500 font-bold"
          datetime={item.timestamp}
        />
      </div>
    </button>
  )
}

export default HistoryItem
