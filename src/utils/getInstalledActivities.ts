import { activities, ActivityName, activityNames } from '../config/activities'
import { scanForApps } from './scanForApps'

/**
 * Installed Apps
 *
 * Uses the scan function above to return the whitelisted apps that are installed
 */
export const getInstalledActivities = async (): Promise<ActivityName[]> => {
  const installedApps = await scanForApps()

  const installedActivityNames = activityNames.filter(name => {
    const activity = activities[name]
    const actShouldAlwaysShow = !activity.appId
    const actIsInstalled =
      activity.appId &&
      installedApps &&
      installedApps.find(app => app === activity.appId)

    return actShouldAlwaysShow || actIsInstalled
  })

  const orderedActivityNames = installedActivityNames.sort(
    (a, b) => activityNames.indexOf(a) - activityNames.indexOf(b),
  )

  return orderedActivityNames
}
