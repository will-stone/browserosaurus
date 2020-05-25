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

interface Props {
  item: UrlHistoryItem
}

const UrlHistoryItem: React.FC<Props> = ({ item }) => {
  const setUrlId = useSetRecoilState(urlIdSelector)

  const url = Url.parse(item.url)
  const urlEnding = [url.pathname, url.search, url.hash].join('')
  const truncatedUrlEnding =
    urlEnding.length > 50 ? `${urlEnding.slice(0, 100)}…` : urlEnding

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault()
      setUrlId(item.id)
    },
    [setUrlId, item.id],
  )

  return (
    <button
      className={cc([
        'transition duration-75 ease-in-out',
        'bg-grey-700',
        'py-2 px-4 w-full rounded',
        'text-left text-grey-300 active:text-white text-sm tracking-wider font-medium break-all',
        'focus:outline-none cursor-default',
      ])}
      onClick={handleClick}
      type="button"
    >
      <span className="opacity-50">{url.protocol}</span>
      <span className="opacity-50">/</span>
      <span className="opacity-50">/</span>
      <span className="font-bold text-base">{url.hostname}</span>
      <span className="opacity-50">
        {url.port && `:${url.port}`}
        {truncatedUrlEnding}
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
    <div className="space-y-2">
      {urlHistoryItemsByTimestamp.map((item) => {
        return <UrlHistoryItem key={item.id} item={item} />
      })}
    </div>
  )
}

export default TheUrlHistory
