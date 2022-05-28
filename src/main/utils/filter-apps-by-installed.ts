import appExists from 'app-exists'

import type { AppId, Apps } from '../../config/apps'
import { getKeys } from '../../shared/utils/get-keys'
import { getAppIcon } from './get-app-icon'

/**
 * Finds installed whitelisted apps.
 */
export async function filterAppsByInstalled(
  apps: Apps,
): Promise<{ id: AppId; icon: string }[]> {
  const installedAppIds: { id: AppId; icon: string }[] = []

  for await (const appId of getKeys(apps)) {
    if (await appExists(appId)) {
      const icon = await getAppIcon(appId)
      installedAppIds.push({ id: appId, icon })
    }
  }

  return installedAppIds
}
