import Url from 'url'

/**
 * Returns the URL domain or undefined if it was already just a domain.
 * This allows for two-step deletion.
 * @param url url string
 */
export function backspaceUrlParse(url?: string): string | undefined {
  if (url) {
    const { protocol, slashes, host, pathname, search, hash } = Url.parse(url)

    const isOnlyDomain = pathname === '/' && !search && !hash

    return isOnlyDomain ? undefined : `${protocol}${slashes ? '//' : ''}${host}`
  }
}
