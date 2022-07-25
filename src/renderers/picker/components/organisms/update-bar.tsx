import clsx from 'clsx'
import { useDispatch } from 'react-redux'

import { useSelector } from '../../../shared/state/hooks'
import { clickedUpdateBar } from '../../state/actions'

const UpdateBar: React.FC = () => {
  const dispatch = useDispatch()
  const updateStatus = useSelector((state) => state.data.updateStatus)

  if (updateStatus === 'available') {
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

  return null
}

export default UpdateBar
