import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import * as Url from 'url'
import { URL_RECEIVED } from '../../config/events'

export const useUrl = (): Url.UrlWithStringQuery => {
  const [urlObj, setUrlObj] = useState<Url.UrlWithStringQuery>({ query: '' })

  useEffect(() => {
    ipcRenderer.on(URL_RECEIVED, (_: unknown, url: string) => {
      setUrlObj(Url.parse(url || ''))
    })

    return function cleanup() {
      ipcRenderer.removeAllListeners(URL_RECEIVED)
    }
  }, [setUrlObj])

  return urlObj
}
