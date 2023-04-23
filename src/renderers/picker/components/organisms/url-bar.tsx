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
    <button
      className={clsx(
        className,
        'flex w-full shrink-0 items-center px-4 py-2 text-center text-sm',
        'border-t border-neutral-400 dark:border-gray-900',
        'cursor-default',
      )}
      onClick={() => dispatch(clickedUrlBar())}
      onKeyDown={() => false}
      tabIndex={-1}
      type="button"
    >
      <div className="grow overflow-hidden text-ellipsis tracking-wider text-black text-opacity-50 dark:text-white dark:text-opacity-50">
        {parsedUrl.hostname?.replace(/^www\./u, '') || (
          <span className="opacity-30">Browserosaurus</span>
        )}
        {parsedUrl.port ? `:${parsedUrl.port}` : null}
      </div>
    </button>
  )
}

export default UrlBar
