import pFilter from 'p-filter'

import { App } from '../config/types'
import { doesAppExist } from './doesAppExist'

/**
 * Finds installed whitelisted apps.
 */
export function filterAppsByInstalled(apps: App[]): Promise<App[]> {
  return pFilter(apps, doesAppExist)
}
