import { faHeart } from '@fortawesome/pro-solid-svg-icons/faHeart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cc from 'classcat'
import React, { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'

import { SPONSOR_URL } from '../../config/CONTANTS'
import { urlSelector } from '../state'
import { LightButton } from './button'

const TheSponsorMenu: React.FC = () => {
  const setUrl = useSetRecoilState(urlSelector)

  const handleButtonClick = useCallback(() => {
    setUrl(SPONSOR_URL)
  }, [setUrl])

  return (
    <div
      className={cc([
        'absolute bg-grey-800 rounded overflow-y-auto overflow-x-hidden border border-grey-600 shadow-xl z-30',
        'animate__animated animate__fadeInUp animate__faster',
      ])}
      style={{ left: '50%', bottom: '60px', right: '8px' }}
    >
      <div className="p-4">
        <p className="mb-4 font-medium">
          Maintaining open source projects takes a lot of time. With your
          support I can continue to maintain projects such as this one, which is
          free and always will be.
        </p>
        <LightButton onClick={handleButtonClick} tone="sponsor">
          <FontAwesomeIcon fixedWidth icon={faHeart} />
          <span>Sponsor from $1 / month</span>
        </LightButton>
      </div>
    </div>
  )
}

export default TheSponsorMenu
