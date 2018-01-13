import { spawn } from 'child_process'
import jp from 'jsonpath'
import parser from 'xml2json'

/**
 * Find installed browsers
 *
 * Scans the system for all known browsers (white-listed in browsers.js file).
 * @returns {Promise} returns array of browser names (Strings) if resolved, and
 * string if rejected.
 */
function findInstalledBrowsers(whiteListedBrowsers) {
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
      const installedBrowsers = Object.keys(whiteListedBrowsers)
        .map(name => {
          for (let i = 0; i < installedApps.length; i++) {
            if (name === installedApps[i]) {
              return name
            }
          }
        })
        .filter(x => x) // remove empties
      fulfill(installedBrowsers)
    })
  })
}

export default findInstalledBrowsers
