import clsx from 'clsx'
import { useDispatch } from 'react-redux'

import { useSelector } from '../../../shared/state/hooks.js'
import { clickedUpdateBar } from '../../state/actions.js'

const UpdateBar: React.FC = () => {
  const dispatch = useDispatch()
  const updateStatus = useSelector((state) => state.data.updateStatus)

  if (updateStatus !== 'available') {
    return null
  }

  return (
    <button
      className={clsx(
        'w-full shrink-0 pb-1',
        'text-center text-xs dark:text-gray-400',
        'cursor-default',
      )}
      onClick={() => dispatch(clickedUpdateBar())}
      type="button"
    >
      Update Available
    </button>
  )
}

export default UpdateBar
