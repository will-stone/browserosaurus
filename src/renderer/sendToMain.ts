import { ipcRenderer } from 'electron'

export const HIDE_WINDOW = 'HIDE_WINDOW'
export const hideWindow = (): void => {
  ipcRenderer.send(HIDE_WINDOW)
}
