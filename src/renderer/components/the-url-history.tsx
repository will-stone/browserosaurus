import React from 'react'
import { useRecoilValue } from 'recoil'
import Url from 'url'

import { UrlHistoryItem } from '../../main/store'
import { urlHistoryState } from '../atoms'

const TheUrlHistory: React.FC = () => {
  const urlHistory: UrlHistoryItem[] = useRecoilValue(urlHistoryState)

  return (
    <div className="divide-y divide-grey-900">
      {urlHistory.map((item) => {
        const url = Url.parse(item.url)
        const urlEnding = [url.pathname, url.search, url.hash].join('')
        const truncatedUrlEnding =
          urlEnding.length > 50 ? `${urlEnding.slice(0, 100)}…` : urlEnding
        return (
          <button
            key={item.url + item.timestamp}
            className="relative py-4 px-4 focus:outline-none w-full text-left text-grey-500 hover:text-grey-300 text-sm tracking-wider font-medium break-all"
            type="button"
          >
            <span className="absolute left-0">-</span>
            <span>{url.protocol}</span>
            <span>/</span>
            <span>/</span>
            <span className="font-bold text-grey-300 text-base">
              {url.hostname}
            </span>
            {url.port && `:${url.port}`}
            {truncatedUrlEnding}
          </button>
        )
      })}
    </div>
  )
}

export default TheUrlHistory
