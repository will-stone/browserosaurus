import { exec } from 'child_process'
import { promisify } from 'util'

import { App, apps } from '../config/apps'

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
 * Finds installed whitelisted apps.
 */
const getInstalledApps = (): Promise<App[]> =>
  // TODO: make this pure.
  filterAsync(apps, async (app) => {
    const { stdout: appPath } = await execP(
      `mdfind 'kMDItemContentType == "com.apple.application-bundle" && kMDItemCFBundleIdentifier == "${app.id}"'`,
    )
    return Boolean(appPath)
  })

export default getInstalledApps
