import { BrowserName, browserNames, browsers } from '../config/browsers'
import { scanForApps } from './scanForApps'

/**
 * Installed Apps
 *
 * Uses the scan function above to return the whitelisted apps that are installed
 */
export const getInstalledBrowsers = async (): Promise<BrowserName[]> => {
  const installedApps = await scanForApps()

  const installedBrowserNames = browserNames.filter(name => {
    const browser = browsers[name]
    const browserShouldAlwaysShow = !browser.appId
    const browserIsInstalled =
      browser.appId &&
      installedApps &&
      installedApps.find(app => app === browser.appId)

    return browserShouldAlwaysShow || browserIsInstalled
  })

  const orderedBrowserNames = installedBrowserNames.sort(
    (a, b) => browserNames.indexOf(a) - browserNames.indexOf(b),
  )

  return orderedBrowserNames
}
