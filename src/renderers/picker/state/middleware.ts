/* eslint-disable unicorn/prefer-regexp-test */
import type { AnyAction, Middleware } from '@reduxjs/toolkit'

import {
  clickedRestorePicker,
  installedAppsRetrieved,
  urlOpened,
} from '../../../shared/state/actions'
import type { RootState } from '../../../shared/state/reducer.root'
import { favAppRef } from '../refs'

/**
 * Pass actions between main and renderers
 */
export const pickerMiddleware =
  (): Middleware<
    // Legacy type parameter added to satisfy interface signature
    Record<string, unknown>,
    RootState
  > =>
  () =>
  (next) =>
  (action: AnyAction) => {
    /**
     * Move to next middleware
     */
    // eslint-disable-next-line node/callback-return -- must flush to get nextState
    const result = next(action)

    if (
      urlOpened.match(action) ||
      clickedRestorePicker.match(action) ||
      installedAppsRetrieved.match(action)
    ) {
      favAppRef.current?.focus()
    }

    return result
  }
