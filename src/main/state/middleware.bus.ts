import { Channel } from '../../shared/state/channels'
import type { Middleware } from '../../shared/state/model'
import { pickerWindow, prefsWindow } from '../windows'

/**
 * Pass actions between main and renderers
 */
export const busMiddleware = (): Middleware => () => (next) => (action) => {
  /**
   * Move to next middleware
   */
  // eslint-disable-next-line node/callback-return -- must flush to get nextState
  const result = next(action)

  // Send actions from main to all renderers
  if (action.type.startsWith(Channel.MAIN)) {
    pickerWindow?.webContents.send(Channel.MAIN, action)
    prefsWindow?.webContents.send(Channel.MAIN, action)
  }
  // Send actions from prefs to picker
  else if (action.type.startsWith(Channel.PREFS)) {
    pickerWindow?.webContents.send(Channel.MAIN, action)
  }
  // Send actions from picker to prefs
  else if (action.type.startsWith(Channel.PICKER)) {
    prefsWindow?.webContents.send(Channel.MAIN, action)
  }

  return result
}
