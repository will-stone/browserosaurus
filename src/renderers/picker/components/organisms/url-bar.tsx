import clsx from 'clsx'
import { useDispatch } from 'react-redux'

import { useSelector } from '../../../shared/state/hooks'
import { clickedUrlBar } from '../../state/actions'

interface Props {
  className?: string
}

const UrlBar: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch()
  const url = useSelector((state) => state.data.url)

  let parsedUrl

  try {
    parsedUrl = new URL(url)
  } catch {
    parsedUrl = { hostname: '', port: '' }
  }

  return (
    <div
      className={clsx(
        className,
        'flex w-full shrink-0 items-center py-2 px-4 text-center text-sm',
        'border-t border-neutral-400 dark:border-gray-900',
        'cursor-default',
      )}
      onClick={() => dispatch(clickedUrlBar())}
      onKeyDown={() => false}
      role="button"
      tabIndex={-1}
    >
      <div className="grow overflow-hidden text-ellipsis tracking-wider text-black text-opacity-50 dark:text-white dark:text-opacity-50">
        {parsedUrl.hostname?.replace(/^www\./u, '') || (
          <span className="opacity-30">Browserosaurus</span>
        )}
        {parsedUrl.port && `:${parsedUrl.port}`}
      </div>
    </div>
  )
}

export default UrlBar
