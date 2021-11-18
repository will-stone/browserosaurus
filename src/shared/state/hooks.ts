import deepEqual from 'fast-deep-equal'
import type { TypedUseSelectorHook } from 'react-redux'
import { shallowEqual, useSelector as useReduxSelector } from 'react-redux'

import type { AppId, Apps } from '../../config/apps'
import { apps as allApps } from '../../config/apps'
import type { RootState } from './reducer.root'

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector

export const useShallowEqualSelector: TypedUseSelectorHook<RootState> = (
  selector,
) => useSelector(selector, shallowEqual)

export const useDeepEqualSelector: TypedUseSelectorHook<RootState> = (
  selector,
) => useSelector(selector, deepEqual)

export interface InstalledApp {
  id: AppId
  name: Apps[AppId]['name']
  privateArg?: string
  urlTemplate?: string
  hotkey: string | null
}

export const useInstalledApps = (): InstalledApp[] => {
  const installedAppIds = useDeepEqualSelector((state) => state.storage.apps)
  return installedAppIds.map((installedApp) => ({
    ...allApps[installedApp.id],
    id: installedApp.id,
    hotkey: installedApp.hotkey,
  }))
}

export const useIsSupportMessageHidden = (): boolean => {
  const supportMessageNumber = useSelector(
    (state) => state.storage.supportMessage,
  )

  const ONE_WEEK = 604_800_000

  return (
    // Hidden by user
    supportMessageNumber === -1 ||
    // Snoozing
    supportMessageNumber > Date.now() - ONE_WEEK
  )
}
