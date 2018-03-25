import uniq from 'lodash/uniq'
import keyBy from 'lodash/keyBy'
import { spawn } from 'child_process'
import jp from 'jsonpath'
import { parseString } from 'xml2js'

/**
 * Scan For Apps
 *
 * Scans the system for all installed apps.
 * @returns {promise} - returns array of app names (Strings) if resolved, and
 * string if rejected.
 */
function scanForApps() {
  return new Promise((fulfill, reject) => {
    const sp = spawn('system_profiler', ['-xml', 'SPApplicationsDataType'])

    let profile = ''

    sp.stdout.setEncoding('utf8')
    sp.stdout.on('data', data => {
      profile += data
    })
    sp.stderr.on('data', data => {
      console.log(`stderr: ${data}`)
      reject(data)
    })
    sp.stdout.on('end', () => {
      parseString(profile, function(err, result) {
        const installedApps = jp.query(
          result,
          'plist.array[0].dict[0].array[1].dict[*].string[0]'
        )

        const unique = uniq(installedApps)

        const toObject = keyBy(unique)
        // returns object of {appName: "appName"} for quicker lookup

        fulfill(toObject)
      })
    })
  })
}

export default scanForApps
