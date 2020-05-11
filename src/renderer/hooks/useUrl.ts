import { ipcRenderer } from 'electron'
import { useEffect, useState } from 'react'
import * as Url from 'url'

import { URL_RECEIVED } from '../../config/events'

const useUrl = (): Url.UrlWithStringQuery => {
  const [urlObject, setUrlObject] = useState<Url.UrlWithStringQuery>({
    query: '',
  })

  useEffect(() => {
    ipcRenderer.on(URL_RECEIVED, (_: unknown, url: string) => {
      setUrlObject(Url.parse(url || ''))
    })

    return function cleanup() {
      ipcRenderer.removeAllListeners(URL_RECEIVED)
    }
  }, [setUrlObject])

  return urlObject
}

export default useUrl
