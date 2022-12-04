import deepEqual from 'fast-deep-equal'
import type { TypedUseSelectorHook } from 'react-redux'
import { shallowEqual, useSelector as useReduxSelector } from 'react-redux'

import type { AppName } from '../../../config/apps'
import type { RootState } from '../../../shared/state/reducer.root'

const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector

const useShallowEqualSelector: TypedUseSelectorHook<RootState> = (selector) =>
  useSelector(selector, shallowEqual)

const useDeepEqualSelector: TypedUseSelectorHook<RootState> = (selector) =>
  useSelector(selector, deepEqual)

interface InstalledApp {
  name: AppName
  hotCode: string | null
}

const useInstalledApps = (): InstalledApp[] => {
  const storedApps = useDeepEqualSelector((state) => state.storage.apps)
  return storedApps
    .filter((storedApp) => storedApp.isInstalled)
    .map((storedApp) => ({
      hotCode: storedApp.hotCode,
      name: storedApp.name,
    }))
}

const useIsSupportMessageHidden = (): boolean => {
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

const useKeyCodeMap = (): Record<string, string> =>
  useShallowEqualSelector((state) => state.data.keyCodeMap)

export {
  InstalledApp,
  useDeepEqualSelector,
  useInstalledApps,
  useIsSupportMessageHidden,
  useKeyCodeMap,
  useSelector,
  useShallowEqualSelector,
}
