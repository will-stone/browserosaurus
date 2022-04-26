import clsx from 'clsx'
import React from 'react'
import { useDispatch } from 'react-redux'
import { parse } from 'uri-js'

import { useSelector } from '../../../shared/state/hooks'
import { clickedUrlBar } from '../../state/actions'

interface Props {
  className?: string
}

const UrlBar: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch()
  const url = useSelector((state) => state.data.url)
  const parsedUrl = parse(url)

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
        {parsedUrl.host?.replace(/^www\./u, '') || (
          <span className="opacity-30">Browserosaurus</span>
        )}
        {parsedUrl.port && `:${parsedUrl.port}`}
      </div>
    </div>
  )
}

export default UrlBar
