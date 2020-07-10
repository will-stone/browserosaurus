import { execFile } from 'child_process'
import { promisify } from 'util'

import { App } from '../config/types'

const execFileP = promisify(execFile)

export async function appExists(nameOrBundleId: string): Promise<boolean> {
  const isBundleId = nameOrBundleId.includes('.')

  const query = isBundleId
    ? `kMDItemContentType == 'com.apple.application-bundle' && kMDItemCFBundleIdentifier == '${nameOrBundleId}'`
    : `kMDItemKind == 'Application' && kMDItemFSName == '${nameOrBundleId}.app'c`

  const { stdout: appPath } = await execFileP('mdfind', [query])

  return Boolean(appPath)
}

export function doesAppExist(app: App): Promise<boolean> {
  return appExists(app.id)
}
