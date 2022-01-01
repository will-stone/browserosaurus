import { app, autoUpdater } from 'electron'

import package_ from '../../../package.json'
import { logger } from '../../shared/utils/logger'
import {
  availableUpdate,
  downloadedUpdate,
  downloadingUpdate,
} from '../state/actions'
import { dispatch } from '../state/store'
import { pickerWindow, prefsWindow } from '../windows'
import { getUpdateUrl } from './get-update-url'
import { isUpdateAvailable } from './is-update-available'

/**
 * Auto update check on production
 */
export async function initUpdateChecker(): Promise<void> {
  if (app.isPackaged) {
    autoUpdater.setFeedURL({
      url: getUpdateUrl(),
      headers: {
        'User-Agent': `${package_.name}/${package_.version} (darwin: ${process.arch})`,
      },
    })

    autoUpdater.on('before-quit-for-update', () => {
      // All windows must be closed before an update can be applied using "restart".
      pickerWindow?.destroy()
      prefsWindow?.destroy()
    })

    autoUpdater.on('update-available', () => {
      dispatch(downloadingUpdate())
    })

    autoUpdater.on('update-downloaded', () => {
      dispatch(downloadedUpdate())
    })

    autoUpdater.on('error', () => {
      logger('AutoUpdater', 'An error has occurred')
    })

    // Run on load
    if (await isUpdateAvailable()) {
      dispatch(availableUpdate())
    }

    // 1000 * 60 * 60 * 24
    const ONE_DAY_MS = 86_400_000

    // Check for updates every day.
    setInterval(async () => {
      if (await isUpdateAvailable()) {
        dispatch(availableUpdate())
      }
    }, ONE_DAY_MS)
  }
}
