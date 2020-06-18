import cc from 'classcat'
import React, { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import Url from 'url'

import { backspaceUrlParse } from '../../utils/backspaceUrlParse'
import { copyUrl } from '../sendToMain'
import { urlSelector } from '../state'
import { DarkButton } from './button'
import Kbd from './kbd'

interface Props {
  className?: string
}

const TheUrlBar: React.FC<Props> = ({ className }) => {
  const [url, setUrl] = useRecoilState(urlSelector)

  const parsedUrl = url ? Url.parse(url) : undefined

  const handleCopyClick = useCallback(() => {
    copyUrl(url)
  }, [url])

  const isUpdateUrl = parsedUrl?.hostname === 'browserosaurus.com'

  const handleBackspaceButtonClick = useCallback(() => {
    setUrl(backspaceUrlParse(url))
  }, [url, setUrl])

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
          <span className="text-grey-500">
            Most recently clicked link will show here
          </span>
        )}

        <button
          className={cc([
            'cursor-default text-base focus:outline-none',
            { 'text-grey-200': parsedUrl },
            { 'text-grey-500': !parsedUrl },
          ])}
          onClick={handleBackspaceButtonClick}
          type="button"
        >
          ⌫
        </button>
      </div>

      <DarkButton disabled={!parsedUrl} onClick={handleCopyClick}>
        <span>Copy</span>
        <Kbd>⌘+C</Kbd>
      </DarkButton>
    </div>
  )
}

export default TheUrlBar
