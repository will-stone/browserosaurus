import { promisify } from 'util'
import { exec } from 'child_process'

const execP = promisify(exec)

/**
 * Scan For Apps
 *
 * Scans the system for all installed apps ids in /Application folder.
 * @returns array of app id (Strings) if resolved, and string if rejected.
 */
export const scanForApps = (): Promise<string[] | ''> =>
  new Promise(resolve => {
    const body = async (): Promise<string[] | ''> => {
      try {
        const { stdout: kMDItemKind } = await execP(
          'mdls -name kMDItemKind -raw /Applications/Safari.app',
        )

        const { stdout: mdfind } = await execP(
          `mdfind -onlyin /Applications kMDItemKind=${kMDItemKind}`,
        )

        const paths = mdfind.trimRight().split('\n')

        const mdls = paths.map(
          async (path: string): Promise<string> => {
            try {
              const { stdout } = await execP(
                `mdls -name kMDItemCFBundleIdentifier -raw "${path}"`,
              )

              return stdout
            } catch (e) {
              return '(null)'
            }
          },
        )

        return Promise.all(mdls)
      } catch (e) {
        return ''
      }
    }

    resolve(body())
  })
