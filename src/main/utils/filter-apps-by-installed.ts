import appExists from 'app-exists'

import type { AppId, Apps } from '../../config/apps'
import { getKeys } from '../../shared/utils/get-keys'

/**
 * Finds installed whitelisted apps.
 */
export async function filterAppsByInstalled(apps: Apps): Promise<AppId[]> {
  const installedAppIds: AppId[] = []
  for await (const appId of getKeys(apps)) {
    if (await appExists(appId)) {
      installedAppIds.push(appId)
    }
  }

  return installedAppIds
}
