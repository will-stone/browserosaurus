import cc from 'classcat'
import React from 'react'
import { useRecoilValue } from 'recoil'
import Url from 'url'

import { parsedSelectedUrlState } from '../selectors'

interface Props {
  className?: string
}

const TheUrlBar: React.FC<Props> = ({ className }) => {
  const parsedSelectedUrl: Url.UrlWithStringQuery | undefined = useRecoilValue(
    parsedSelectedUrlState,
  )

  return (
    <div
      className={cc([
        className,
        'flex-shrink-0 flex items-center',
        'bg-grey-800',
        'border-b border-grey-900',
        'text-xs text-grey-500 tracking-wider font-medium',
        'h-10 px-4',
      ])}
    >
      {parsedSelectedUrl ? (
        <span className="truncate">
          {parsedSelectedUrl.protocol}
          <span>/</span>
          <span>/</span>
          <span className="font-bold text-grey-300 text-sm">
            {parsedSelectedUrl.hostname}
          </span>
          {parsedSelectedUrl.port && `:${parsedSelectedUrl.port}`}
          {parsedSelectedUrl.pathname}
          {parsedSelectedUrl.search}
          {parsedSelectedUrl.hash}
        </span>
      ) : (
        <span className="text-xs">
          Most recently clicked link will show here
        </span>
      )}
    </div>
  )
}

export default TheUrlBar
