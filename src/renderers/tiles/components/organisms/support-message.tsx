import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'

import {
  clickedDonate,
  clickedMaybeLater,
} from '../../../../shared/state/actions'
import { useIsSupportMessageHidden } from '../../../../shared/state/hooks'

const SupportMessage = (): JSX.Element => {
  const dispatch = useDispatch()
  const isSupportMessageHidden = useIsSupportMessageHidden()

  return (
    <div
      className={clsx(
        'absolute inset-0',
        'grid grid-cols-12 gap-4 bg-blueGray-800 text-blueGray-400 overflow-y-auto px-8',
        isSupportMessageHidden && 'hidden',
      )}
    >
      <div className="col-span-7 flex flex-col justify-center space-y-2">
        <p>
          Thank you for downloading Browserosaurus. Please consider buying me a
          coffee.
        </p>
        <p>
          Thank you{' '}
          <span aria-label="kiss emoji" role="img">
            😘
          </span>
        </p>
        <p>— Will</p>
      </div>

      <div className="col-span-5 flex flex-col justify-center items-stretch space-y-4">
        <button
          className="bg-blueGray-900 text-blueGray-100 p-4 rounded text-xl focus:outline-none active:opacity-75"
          onClick={() => dispatch(clickedDonate())}
          type="button"
        >
          Buy Me a Coffee
        </button>
        <button
          className="bg-blueGray-900 text-blueGray-300 p-2 rounded focus:outline-none active:opacity-75"
          onClick={() => dispatch(clickedMaybeLater())}
          type="button"
        >
          Maybe Later
        </button>
      </div>
    </div>
  )
}

export default SupportMessage
