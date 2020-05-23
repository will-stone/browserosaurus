import React from 'react'
import { useRecoilValue } from 'recoil'

import { UrlHistoryItem } from '../../main/store'
import { urlHistoryState } from '../atoms'

const TheUrlHistory: React.FC = () => {
  const urlHistory: UrlHistoryItem[] = useRecoilValue(urlHistoryState)

  return (
    <ul>
      {urlHistory.map((item) => (
        <li key={item.url + item.timestamp}>{item.url}</li>
      ))}
    </ul>
  )
}

export default TheUrlHistory
