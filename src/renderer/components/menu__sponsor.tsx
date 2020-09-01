import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { clickedSponsorButton } from '../store/actions'
import Button from './atoms/button'

const SponsorMenu: React.FC = () => {
  const dispatch = useDispatch()

  const handleButtonClick = useCallback(() => {
    dispatch(clickedSponsorButton())
  }, [dispatch])

  return (
    <div
      className={clsx(
        'absolute bg-grey-800 rounded overflow-y-auto overflow-x-hidden border border-grey-600 shadow-xl z-30',
        'animate__animated animate__fadeInUp animate__faster',
      )}
      style={{ top: '8px', left: '50%', bottom: '45px', right: '8px' }}
    >
      <div className="p-4">
        <p className="mb-4 font-medium">
          Maintaining open source projects takes a lot of time. With your
          support I can continue to maintain projects such as this one, which is
          free and always will be.
        </p>
        <Button onClick={handleButtonClick} tone="sponsor">
          <FontAwesomeIcon fixedWidth icon={faHeart} />
          <span>Sponsor from $1 / month</span>
        </Button>
      </div>
    </div>
  )
}

export default SponsorMenu
