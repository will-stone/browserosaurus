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
        'shrink-0 w-full py-2 px-4 text-center flex items-center text-sm',
        'bg-neutral-200 dark:bg-gray-900 border-t border-neutral-400 dark:border-gray-900',
        'cursor-default',
      )}
      onClick={() => dispatch(clickedUrlBar())}
      onKeyDown={() => false}
      role="button"
      tabIndex={-1}
    >
      <div className="flex-grow tracking-wider text-opacity-50 dark:text-opacity-50 text-black dark:text-white text-ellipsis overflow-hidden">
        {parsedUrl.hostname?.replace(/^www\./u, '') || (
          <span className="opacity-30">Browserosaurus</span>
        )}
        {parsedUrl.port && `:${parsedUrl.port}`}
      </div>
    </div>
  )
}

export default UrlBar
