import type { Rectangle } from 'electron/main'

import type { AppName } from '../../config/apps.js'
import type { Data } from '../../shared/state/reducer.data.js'
import type { Storage } from '../../shared/state/reducer.storage.js'
import { actionNamespacer } from '../../shared/utils/action-namespacer.js'

const main = actionNamespacer('main')

const readiedApp = main('app/readied')

const openedUrl = main<string>('url/opened')

const changedPickerWindowBounds = main<Rectangle>(
  'picker-window-bounds/changed',
)

const startedScanning = main('installed-apps/scanning')

const retrievedInstalledApps = main<AppName[]>('installed-apps/retrieved')

const receivedRendererStartupSignal = main<{ data: Data; storage: Storage }>(
  'sync-reducers',
)

const gotDefaultBrowserStatus = main<boolean>('default-browser-status/got')

const gotAppIcons = main<Partial<Record<AppName, string>>>('app-icons/got')

const availableUpdate = main('update/available')
const downloadingUpdate = main('update/downloading')
const downloadedUpdate = main('update/downloaded')

const tray = actionNamespacer('tray')

const clickedRestorePicker = tray('restore-picker/clicked')
const clickedOpenPrefs = tray('open-prefs/clicked')

export {
  availableUpdate,
  changedPickerWindowBounds,
  clickedOpenPrefs,
  clickedRestorePicker,
  downloadedUpdate,
  downloadingUpdate,
  gotAppIcons,
  gotDefaultBrowserStatus,
  openedUrl,
  readiedApp,
  receivedRendererStartupSignal,
  retrievedInstalledApps,
  startedScanning,
}
