import { execFile } from 'child_process'
import { promisify } from 'util'

import { App } from '../config/types'

const execFileP = promisify(execFile)

export async function doesAppExist(app: App): Promise<boolean> {
  const { stdout: appPath } = await execFileP('mdfind', [
    `kMDItemContentType == 'com.apple.application-bundle' && kMDItemCFBundleIdentifier == '${app.id}'`,
  ])
  return Boolean(appPath)
}
