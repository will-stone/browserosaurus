import { spawn } from 'child_process'
import * as jp from 'jsonpath'
import { keyBy, uniq } from 'lodash'
import * as xml2js from 'xml2js'
import { activities, ActivityName, activityNames } from '../config/activities'

/**
 * Scan For Apps
 *
 * Scans the system for all installed apps.
 * @returns array of app names (Strings) if resolved, and string if rejected.
 */
const scanForApps = (): Promise<{}> =>
  new Promise(resolve => {
    const sp = spawn('system_profiler', ['-xml', 'SPApplicationsDataType'])

    let profile = ''

    sp.stdout.setEncoding('utf8')
    sp.stdout.on('data', data => {
      profile += data
    })
    sp.stdout.on('end', () => {
      xml2js.parseString(profile, (_, result) => {
        const installedApps = jp.query(
          result,
          'plist.array[0].dict[0].array[1].dict[*].string[0]',
        )

        const unique = uniq(installedApps)

        const toObject = keyBy(unique)
        // returns object of {appName: "appName"} for quicker lookup

        resolve(toObject)
      })
    })
  })

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
    const actIsInstalled = !!(activity.appId && installedApps[activity.appId])
    if (actShouldAlwaysShow || actIsInstalled) return true
    return false
  })

  const orderedActivityNames = installedActivityNames.sort(
    (a, b) => activityNames.indexOf(a) - activityNames.indexOf(b),
  )

  return orderedActivityNames
}
