import appExists from 'app-exists'
import pFilter from 'p-filter'

import type { AppId, Apps } from '../../config/apps'
import { getKeys } from '../../shared/utils/get-keys'

/**
 * Finds installed whitelisted apps.
 */
export function filterAppsByInstalled(apps: Apps): Promise<AppId[]> {
  return pFilter(getKeys(apps), (id) => appExists(id))
}
