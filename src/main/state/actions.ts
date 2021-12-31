import type { Rectangle } from 'electron/main'
import type { CombinedState } from 'redux'

import type { AppId } from '../../config/apps'
import type { Data } from '../../shared/state/reducer.data'
import type { Storage } from '../../shared/state/reducer.storage'
import { actionNamespacer } from '../../shared/utils/action-namespacer'

const cA = actionNamespacer('main')

const appReady = cA('app/ready')

const urlOpened = cA<string>('url/opened')

const pickerWindowBoundsChanged = cA<Rectangle>('picker-window/bounds-changed')

const installedAppsRetrieved = cA<AppId[]>('installed-apps/returned')

const syncReducers =
  cA<CombinedState<{ data: Data; storage: Storage }>>('sync-reducers')

const gotAppVersion = cA<string>('app-version/returned')
const gotDefaultBrowserStatus = cA<boolean>('default-browser-status/returned')

const updateAvailable = cA('update/available')
const updateDownloading = cA('update/downloading')
const updateDownloaded = cA('update/downloaded')

const clickedRestorePicker = cA('restore-picker/clicked')
const clickedOpenPrefs = cA('open-prefs/clicked')

export {
  appReady,
  clickedOpenPrefs,
  clickedRestorePicker,
  gotAppVersion,
  gotDefaultBrowserStatus,
  installedAppsRetrieved,
  pickerWindowBoundsChanged,
  syncReducers,
  updateAvailable,
  updateDownloaded,
  updateDownloading,
  urlOpened,
}
