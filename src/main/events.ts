import { createAction as cA } from '@reduxjs/toolkit'

import type { App } from '../config/types'
import type { ThemeState } from '../renderer/store/reducers'
import type { Store } from './store'

export const MAIN_EVENT = 'MAIN_EVENT'

const urlUpdated = cA<string>('main/urlUpdated')

const gotTheme = cA<ThemeState>('main/gotTheme')
const gotAppVersion = cA<string>('main/gotAppVersion')
const gotInstalledApps = cA<App[]>('main/gotInstalledApps')
const gotDefaultBrowserStatus = cA<boolean>('main/gotDefaultBrowserStatus')
const gotStore = cA<Store>('main/gotStore')

const updateAvailable = cA('main/updateAvailable')
const updateDownloading = cA('main/updateDownloading')
const updateDownloaded = cA('main/updateDownloaded')

export {
  gotAppVersion,
  gotDefaultBrowserStatus,
  gotInstalledApps,
  gotStore,
  gotTheme,
  updateAvailable,
  updateDownloaded,
  updateDownloading,
  urlUpdated,
}
