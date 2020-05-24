// TODO remove this when components abstracted out
/* eslint-disable react/no-multi-comp */

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
      className="relative py-4 px-4 focus:outline-none w-full text-left text-grey-500 hover:text-grey-300 text-sm tracking-wider font-medium break-all"
      onClick={handleClick}
      type="button"
    >
      <span className="absolute left-0">-</span>
      <span>{url.protocol}</span>
      <span>/</span>
      <span>/</span>
      <span className="font-bold text-grey-300 text-base">{url.hostname}</span>
      {url.port && `:${url.port}`}
      {truncatedUrlEnding}
    </button>
  )
}

const TheUrlHistory: React.FC = () => {
  const urlHistory: UrlHistoryStore = useRecoilValue(urlHistoryAtom)
  const urlHistoryItemsByTimestamp = selectUrlHistoryItemsByTimestamp(
    urlHistory,
  )

  return (
    <div className="divide-y divide-grey-900">
      {urlHistoryItemsByTimestamp.map((item) => {
        return <UrlHistoryItem key={item.id} item={item} />
      })}
    </div>
  )
}

export default TheUrlHistory
