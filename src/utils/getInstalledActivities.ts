import { spawn } from 'child_process'
import * as jp from 'jsonpath'
import { keyBy, uniq } from 'lodash'
import * as xml2js from 'xml2js'
import { activities } from '../config/activities'
import { Activity } from '../model'

/**
 * Scan For Apps
 *
 * Scans the system for all installed apps.
 * @returns array of app names (Strings) if resolved, and string if rejected.
 */
const scanForApps = (): Promise<{}> =>
  new Promise((resolve, reject) => {
    const sp = spawn('system_profiler', ['-xml', 'SPApplicationsDataType'])

    let profile = ''

    sp.stdout.setEncoding('utf8')
    sp.stdout.on('data', data => {
      profile += data
    })
    sp.stderr.on('data', data => {
      reject(data)
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
export const getInstalledActivities = async () => {
  const installedApps = await scanForApps()

  const installedActivities = activities
    .filter((activity: Activity) => {
      if (activity.appId && installedApps[activity.appId]) {
        return true
      } else if (!activity.appId) {
        // always show activity that does not depend on app presence
        return true
      }
      return false
    })
    .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

  return installedActivities
}
