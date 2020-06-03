import { faTrashAlt } from '@fortawesome/pro-solid-svg-icons/faTrashAlt'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback } from 'react'
import { useRecoilValue } from 'recoil'

import { urlHistoryAtom } from '../atoms'
import { clearHistory } from '../sendToMain'
import { LightButton } from './button'
import HistoryItem from './history-item'

const TheHistoryMenu: React.FC = () => {
  const urlHistory = useRecoilValue(urlHistoryAtom)

  const handleClearClick = useCallback(() => {
    clearHistory()
  }, [])

  return (
    <div
      className="absolute bg-grey-800 rounded overflow-y-auto overflow-x-hidden border border-grey-600 shadow-xl z-30"
      style={{ top: '60px', right: '140px', bottom: '8px', left: '24px' }}
    >
      <div className="p-4 space-y-4">
        <div>
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

        <div className="text-center">
          <LightButton onClick={handleClearClick}>
            <FontAwesomeIcon icon={faTrashAlt} />
            <span>Clear History</span>
          </LightButton>
        </div>
      </div>
    </div>
  )
}

export default TheHistoryMenu
