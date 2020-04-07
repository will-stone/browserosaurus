import { exec } from 'child_process'
import { promisify } from 'util'

import { Browser, browsers } from '../config/browsers'

const execP = promisify(exec)

/**
 * Asynchronously filters an array.
 * Used this SO answer for inspiration: https://stackoverflow.com/a/53508547
 */
async function filterAsync<T>(
  array: readonly T[],
  filterFn: (value: T, index: number, array: readonly T[]) => Promise<boolean>,
): Promise<T[]> {
  const filterMap = await Promise.all(array.map(filterFn))
  return array.filter((_, index) => filterMap[index])
}

/**
 * Finds installed whitelisted browsers.
 */
const getInstalledBrowsers = (): Promise<Browser[]> =>
  // TODO: make this pure.
  filterAsync(browsers, async (browser) => {
    const { stdout: appPath } = await execP(
      `mdfind 'kMDItemContentType == "com.apple.application-bundle" && kMDItemCFBundleIdentifier == "${browser.id}"'`,
    )
    return Boolean(appPath)
  })

export default getInstalledBrowsers
