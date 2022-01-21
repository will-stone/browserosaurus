import { parse } from 'uri-js'

/**
 * Returns the URL domain or undefined if it was already just a domain.
 * This allows for two-step deletion.
 * @param url url string
 */
export function backspaceUrlParse(url: string): string {
  if (url) {
    const { scheme, host, port, path, query, fragment } = parse(url)

    if (fragment) {
      return [
        scheme,
        '://',
        host,
        port ? `:${port}` : '',
        path,
        query ? `?${query}` : '',
      ].join('')
    }

    if (query) {
      const searchParameters = new URLSearchParams(query)
      const searchParametersArray: string[] = []

      for (const [key, value] of searchParameters.entries()) {
        searchParametersArray.push(`${key}=${value}`)
      }

      if (searchParametersArray.length > 1) {
        const minusLast = searchParametersArray.slice(0, -1)
        const searchParametersString = minusLast.join('&')

        return [
          scheme,
          '://',
          host,
          port ? `:${port}` : '',
          path,
          '?',
          searchParametersString,
        ].join('')
      }

      return `${scheme}://${host}${port ? `:${port}` : ''}${path}`
    }

    if (path && path !== '/') {
      const pathnameArray = path.split('/').filter(Boolean)

      if (pathnameArray.length > 1) {
        const minusLast = pathnameArray.slice(0, -1)
        const pathnameString = minusLast.join('/')
        return `${scheme}://${host}${port ? `:${port}` : ''}/${pathnameString}/`
      }

      return `${scheme}://${host}${port ? `:${port}` : ''}/`
    }
  }

  return ''
}
