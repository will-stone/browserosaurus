import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'

import { useIsSupportMessageHidden } from '../../../shared/state/hooks'
import { clickedDonate, clickedMaybeLater } from '../../state/actions'

const SupportMessage = (): JSX.Element => {
  const dispatch = useDispatch()
  const isSupportMessageHidden = useIsSupportMessageHidden()

  return (
    <div
      className={clsx(
        'absolute inset-0 flex flex-col justify-center',
        'bg-slate-800 text-slate-400 overflow-y-auto p-4',
        isSupportMessageHidden && 'hidden',
      )}
    >
      <div className="flex flex-col justify-center space-y-2">
        <p>
          Thank you for downloading Browserosaurus. Please consider supporting
          my open source projects.
        </p>
        <p>
          Thank you{' '}
          <span aria-label="kiss emoji" role="img">
            😘
          </span>
        </p>
        <p>— Will</p>
      </div>

      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          className="grow bg-slate-900 text-slate-100 p-2 rounded focus:outline-none active:opacity-75"
          onClick={() => dispatch(clickedDonate())}
          type="button"
        >
          Buy Me a Coffee
        </button>
        <button
          className="grow text-slate-300 p-2 rounded focus:outline-none active:opacity-75"
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
