import type { AppThunk } from '../../../shared/state/reducer.root'
import { customWindow } from '../custom.window'
import { gotKeyLayoutMap } from './actions'

const getLayoutObject = async (): Promise<Record<string, string>> => {
  try {
    const keyboardLayoutMap =
      await customWindow.navigator.keyboard.getLayoutMap()
    const keyValueObject: Record<string, string> = {}

    for (const [key, value] of keyboardLayoutMap.entries()) {
      keyValueObject[key] = value
    }

    return keyValueObject
  } catch {
    return {}
  }
}

/**
 * THUNK - Retrieve all code to key mappings.
 * Only use in a renderer process, where window object is available.
 */
export const getKeyLayout = (): AppThunk => async (dispatch) => {
  const layoutObject = await getLayoutObject()
  dispatch(gotKeyLayoutMap(layoutObject))
}
