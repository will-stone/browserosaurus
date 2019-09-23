import { spawn } from 'child_process'
import * as jp from 'jsonpath'
import { keyBy, uniq } from 'lodash'
import * as xml2js from 'xml2js'

/**
 * Scan For Apps
 *
 * Scans the system for all in stalled apps.
 * @returns array of app names (Strings) if resolved, and string if rejected.
 */
export const scanForApps = (): Promise<{}> =>
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
