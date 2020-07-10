import cc from 'classcat'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import Url from 'url'

import { SPONSOR_URL } from '../../config/CONSTANTS'
import { copyUrl } from '../sendToMain'
import { useSelector } from '../store'
import { clickedUrlBackspaceButton } from '../store/actions'
import { DarkButton } from './atoms/button'
import Kbd from './atoms/kbd'

interface Props {
  className?: string
}

const UrlBar: React.FC<Props> = ({ className }) => {
  const dispatch = useDispatch()
  const url = useSelector((state) => state.ui.url)

  const parsedUrl = url ? Url.parse(url) : undefined

  const handleCopyClick = useCallback(() => {
    copyUrl(url)
  }, [url])

  const isSponsorUrl = url === SPONSOR_URL

  const handleBackspaceButtonClick = useCallback(() => {
    dispatch(clickedUrlBackspaceButton())
  }, [dispatch])

  return (
    <div className={cc([className, 'flex items-center space-x-4'])}>
      <div
        className={cc([
          'flex-grow',
          { 'border-grey-900 text-grey-400 border-b': !isSponsorUrl },
          { 'border-pink-500 text-pink-200 border-b-2': isSponsorUrl },
          'text-xs tracking-wider font-bold',
          'h-10',
          'flex items-center justify-between',
          'overflow-hidden',
        ])}
      >
        {parsedUrl ? (
          <div className="truncate">
            <span>{parsedUrl.protocol}</span>
            {parsedUrl.slashes && '//'}
            <span
              className={cc([
                'text-base',
                { 'text-grey-200': !isSponsorUrl },
                { 'text-pink-400': isSponsorUrl },
              ])}
            >
              {parsedUrl.host}
            </span>
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
            'text-base focus:outline-none',
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

export default UrlBar
