import React from 'react'
import { useRecoilValue } from 'recoil'

import { UrlHistoryItem } from '../../main/store'
import { urlHistoryState } from '../store/atoms'

const TheUrlHistory: React.FC = () => {
  const urlHistory: UrlHistoryItem[] = useRecoilValue(urlHistoryState)

  return (
    <ul>
      {urlHistory
        // Make copy of array as "reverse" is mutative
        .slice()
        .reverse()
        .map((item) => (
          <li key={item.url + item.timestamp}>{item.url}</li>
        ))}
    </ul>
  )
}

export default TheUrlHistory
