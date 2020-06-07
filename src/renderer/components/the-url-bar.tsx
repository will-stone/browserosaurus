import cc from 'classcat'
import React, { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import Url from 'url'

import { copyUrl } from '../sendToMain'
import { urlSelector } from '../state'
import { DarkButton } from './button'
import Kbd from './kbd'

interface Props {
  className?: string
}

const TheUrlBar: React.FC<Props> = ({ className }) => {
  const url = useRecoilValue(urlSelector)

  const parsedUrl = url ? Url.parse(url) : undefined

  const handleCopyClick = useCallback(() => {
    copyUrl(url)
  }, [url])

  const isUpdateUrl = parsedUrl?.hostname === 'browserosaurus.com'

  return (
    <div className={cc([className, 'flex items-center space-x-4'])}>
      <div
        className={cc([
          'flex-grow',
          { 'border-b': !isUpdateUrl },
          { 'border-b-2': isUpdateUrl },
          { 'border-grey-900': !isUpdateUrl },
          { 'border-blue-500': isUpdateUrl },
          'text-xs tracking-wider font-bold text-grey-400',
          'h-10',
          'flex items-center justify-between',
          'overflow-hidden',
          'cursor-default',
        ])}
      >
        <div className="flex items-center space-x-2 truncate">
          {parsedUrl ? (
            <div className="truncate">
              <span>{parsedUrl.protocol}</span>
              {parsedUrl.slashes && '//'}
              <span className="text-grey-200 text-base">{parsedUrl.host}</span>
              <span>
                {parsedUrl.pathname}
                {parsedUrl.search}
                {parsedUrl.hash}
              </span>
            </div>
          ) : (
            <span>Most recently clicked link will show here</span>
          )}
        </div>
      </div>

      <DarkButton disabled={!parsedUrl} onClick={handleCopyClick}>
        <span>Copy</span>
        <Kbd>⌘+C</Kbd>
      </DarkButton>
    </div>
  )
}

export default TheUrlBar
