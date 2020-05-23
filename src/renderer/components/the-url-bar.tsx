import cc from 'classcat'
import React from 'react'
import { useRecoilValue } from 'recoil'
import Url from 'url'

import { parsedLatestUrlState } from '../store/selectors'

interface Props {
  className?: string
}

const TheUrlBar: React.FC<Props> = ({ className }) => {
  const parsedUrl: Url.UrlWithStringQuery | undefined = useRecoilValue(
    parsedLatestUrlState,
  )

  return (
    <div
      className={cc([
        className,
        'flex-shrink-0 bg-grey-800 h-10 flex items-center px-4 text-grey-500 border-b border-grey-900 tracking-wider font-medium text-xs',
      ])}
    >
      {parsedUrl ? (
        <span className="truncate">
          {parsedUrl.protocol}
          <span>/</span>
          <span>/</span>
          <span className="font-bold text-grey-300 text-sm">
            {parsedUrl.hostname}
          </span>
          {parsedUrl.port && `:${parsedUrl.port}`}
          {parsedUrl.pathname}
          {parsedUrl.search}
          {parsedUrl.hash}
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
