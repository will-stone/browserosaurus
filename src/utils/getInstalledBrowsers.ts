import { exec } from 'child_process'
import { promisify } from 'util'

import { BrowserName, browserNames, browsers } from '../config/browsers'

const execP = promisify(exec)

/**
 * Installed Browsers
 *
 * Finds installed whitelisted browsers.
 */
export const getInstalledBrowsers = async (): Promise<BrowserName[]> => {
  const installedBrowserNames = (await Promise.all(
    browserNames.map(async name => {
      const browser = browsers[name]
      const { stdout: appPath } = await execP(
        `mdfind kMDItemCFBundleIdentifier = "${browser.appId}"`,
      )
      if (!appPath) {
        return
      }
      return name
    }),
  )).filter((name): name is BrowserName => {
    if (name === undefined) return false
    return true
  })

  return installedBrowserNames
}
