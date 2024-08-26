/* eslint-disable unicorn/prefer-regexp-test */
import type { Middleware } from 'redux'

import {
  clickedRestorePicker,
  openedUrl,
  retrievedInstalledApps,
} from '../../../main/state/actions.js'
import { getKeyLayout } from '../../shared/utils/get-key-layout-map.js'
import { appsRef, appsScrollerRef } from '../refs.js'
import { clickedDonate, clickedMaybeLater } from './actions.js'

/**
 * Pass actions between main and renderers
 */
export const pickerMiddleware =
  (): Middleware =>
  ({ dispatch }) =>
  (next) =>
  (action) => {
    // eslint-disable-next-line n/callback-return -- Move to next middleware
    const result = next(action)

    const doesActionOpenPicker =
      openedUrl.match(action) || clickedRestorePicker.match(action)

    if (
      doesActionOpenPicker ||
      retrievedInstalledApps.match(action) ||
      clickedDonate.match(action) ||
      clickedMaybeLater.match(action)
    ) {
      appsRef.current?.[0].focus()
      appsScrollerRef.current?.scrollTo({ top: 0 })
    }

    if (doesActionOpenPicker) {
      getKeyLayout(dispatch)
    }

    return result
  }
