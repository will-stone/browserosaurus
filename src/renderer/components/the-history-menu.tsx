import React from 'react'
import { useRecoilValue } from 'recoil'

import { urlHistoryAtom } from '../atoms'
import HistoryItem from './history-item'

const TheHistoryMenu: React.FC = () => {
  const urlHistory = useRecoilValue(urlHistoryAtom)

  return (
    <div
      className="absolute bg-grey-800 rounded overflow-y-auto overflow-x-hidden border border-grey-600 shadow-xl z-30"
      style={{ top: '60px', right: '140px', bottom: '8px', left: '24px' }}
    >
      <div className="p-4">
        {urlHistory
          .slice()
          .reverse()
          .map((item, i) => {
            const isStriped = Boolean((i + 1) % 2)
            return (
              <HistoryItem key={item.id} isStriped={isStriped} item={item} />
            )
          })}
      </div>
    </div>
  )
}

export default TheHistoryMenu
