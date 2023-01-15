import clsx from 'clsx'
import { useDispatch } from 'react-redux'

import { useIsSupportMessageHidden } from '../../../shared/state/hooks'
import { clickedDonate, clickedMaybeLater } from '../../state/actions'

const SupportMessage = (): JSX.Element => {
  const dispatch = useDispatch()
  const isSupportMessageHidden = useIsSupportMessageHidden()

  return (
    <div
      className={clsx(
        'absolute inset-0 flex flex-col',
        'overflow-y-auto bg-slate-800 text-slate-400',
        isSupportMessageHidden && 'hidden',
      )}
    >
      <div className="p-4">
        <p>
          Thank you for downloading Browserosaurus. Please consider supporting
          my open source projects.
        </p>

        <p>
          Thank you <span aria-label="kiss emoji">&#128536;</span> — Will.
        </p>

        <div className="mt-2 flex items-center justify-center gap-2">
          <button
            className="grow rounded bg-slate-900 p-1 text-slate-100 focus:outline-none active:opacity-75"
            onClick={() => dispatch(clickedDonate())}
            type="button"
          >
            Buy Me a Coffee
          </button>
          <button
            className="grow rounded p-1 text-slate-300 focus:outline-none active:opacity-75"
            onClick={() => dispatch(clickedMaybeLater())}
            type="button"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}

export default SupportMessage
