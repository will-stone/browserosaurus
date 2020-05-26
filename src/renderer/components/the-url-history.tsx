// TODO remove this when components abstracted out
/* eslint-disable react/no-multi-comp */

import cc from 'classcat'
import React, { useCallback } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import Url from 'url'

import {
  selectUrlHistoryItemsByTimestamp,
  UrlHistoryItem,
  UrlHistoryStore,
} from '../../main/stores'
import { urlHistoryAtom } from '../atoms'
import { urlIdSelector } from '../selectors'
import ProtocolIcon from './protocol-icon'

interface Props {
  isStriped: boolean
  item: UrlHistoryItem
}

const UrlHistoryItem: React.FC<Props> = ({ isStriped, item }) => {
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

  return (
    <button
      className={cc([
        'p-4 w-full rounded flex items-center space-x-2',
        'text-left text-xs tracking-wider font-medium',
        'focus:outline-none cursor-default',
        { 'bg-grey-700': isStriped && !isActive },
        { 'text-grey-500': !isActive },
        { 'bg-blue-700 text-teal-100': isActive },
      ])}
      onClick={handleClick}
      type="button"
    >
      <ProtocolIcon className="flex-shrink-0" urlProtocol={url.protocol} />
      <span className="truncate">
        <span
          className={cc([
            'font-bold text-sm',
            { 'text-grey-300': !isActive },
            { 'text-white': isActive },
          ])}
        >
          {url.hostname}
        </span>
        <span>
          {url.port && `:${url.port}`}
          {urlEnding}
        </span>
      </span>
    </button>
  )
}

const TheUrlHistory: React.FC = () => {
  const urlHistory: UrlHistoryStore = useRecoilValue(urlHistoryAtom)
  const urlHistoryItemsByTimestamp = selectUrlHistoryItemsByTimestamp(
    urlHistory,
  )

  return (
    <div>
      {urlHistoryItemsByTimestamp.map((item, i) => {
        const isStriped = Boolean((i + 1) % 2)
        return (
          <UrlHistoryItem key={item.id} isStriped={isStriped} item={item} />
        )
      })}
    </div>
  )
}

export default TheUrlHistory
