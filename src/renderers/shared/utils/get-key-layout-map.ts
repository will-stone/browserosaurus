import type { Dispatch } from '@reduxjs/toolkit'

import type { FSA } from '../../../shared/state/model'
import { gotKeyLayoutMap } from '../state/actions'

const getLayoutObject = async (): Promise<Record<string, string>> => {
  try {
    const keyboardLayoutMap = await window.navigator.keyboard.getLayoutMap()

    const keyValueObject: Record<string, string> = {}

    for (const [key, value] of keyboardLayoutMap.entries()) {
      keyValueObject[key] = value
    }

    return keyValueObject
  } catch (error: unknown) {
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }

    return {}
  }
}

/**
 * Retrieve all code to key mappings.
 * Only use in a renderer process, where window object is available.
 */
export const getKeyLayout = async (dispatch: Dispatch<FSA>): Promise<void> => {
  const layoutObject = await getLayoutObject()
  dispatch(gotKeyLayoutMap(layoutObject))
}
