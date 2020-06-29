import Url from 'url'

/**
 * Returns the URL domain or undefined if it was already just a domain.
 * This allows for two-step deletion.
 * @param url url string
 */
export function backspaceUrlParse(url?: string): string | undefined {
  if (url) {
    const { protocol, slashes, host, pathname, search, hash } = Url.parse(url)

    if (hash) {
      return `${protocol}${slashes ? '//' : ''}${host}${pathname}${search}`
    }

    if (search) {
      const searchParameters = new URLSearchParams(search)
      const searchParametersArray: string[] = []
      searchParameters.forEach((value, key) => {
        searchParametersArray.push(`${key}=${value}`)
      })
      if (searchParametersArray.length > 1) {
        const minusLast = searchParametersArray.slice(0, -1)
        const searchParametersString = minusLast.join('&')

        return [
          protocol,
          slashes ? '//' : '',
          host,
          pathname,
          '?',
          searchParametersString,
        ].join('')
      }

      return `${protocol}${slashes ? '//' : ''}${host}${pathname}`
    }

    if (pathname && pathname !== '/') {
      const pathnameArray = pathname.split('/').filter(Boolean)
      if (pathnameArray.length > 1) {
        const minusLast = pathnameArray.slice(0, -1)
        const pathnameString = minusLast.join('/')
        return `${protocol}${slashes ? '//' : ''}${host}/${pathnameString}/`
      }

      return `${protocol}${slashes ? '//' : ''}${host}/`
    }
  }
}
