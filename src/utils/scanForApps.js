import { spawn } from 'child_process'
import jp from 'jsonpath'
import parser from 'xml2json'

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
      profile = parser.toJson(profile, { object: true })
      const installedApps = jp.query(
        profile,
        'plist.array.dict.array[1].dict[*].string[0]'
      )
      fulfill(installedApps)
    })
  })
}

export default scanForApps
