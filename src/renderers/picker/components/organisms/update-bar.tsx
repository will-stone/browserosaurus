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
          'shrink-0 w-full pb-1',
          'text-center text-xs dark:text-gray-400',
          'bg-neutral-200 dark:bg-gray-900',
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
