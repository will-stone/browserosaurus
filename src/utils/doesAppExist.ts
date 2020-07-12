import appExists from 'app-exists'

import { App } from '../config/types'

export function doesAppExist(app: App): Promise<boolean> {
  return appExists(app.id)
}
