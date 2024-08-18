/* eslint-disable @typescript-eslint/no-unused-vars */
import { pickerWindow, prefsWindow } from '../windows'

/**
 * When exiting the app, the windows must first be removed from memory so that
 * any residually running JS does not try to access them, causing a crash.
 * https://stackoverflow.com/questions/38309240/object-has-been-destroyed-when-open-secondary-child-window-in-electron-js
 */
export function removeWindowsFromMemory(): void {
  // @ts-expect-error -- window must be destroyed to prevent race condition
  prefsWindow = null
  // @ts-expect-error -- window must be destroyed to prevent race condition
  pickerWindow = null
}
