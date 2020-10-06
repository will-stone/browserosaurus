import appExists from 'app-exists'
import pFilter from 'p-filter'

import { App } from '../config/types'

/**
 * Finds installed whitelisted apps.
 */
export function filterAppsByInstalled(apps: App[]): Promise<App[]> {
  return pFilter(apps, (app) => appExists(app.id))
}
