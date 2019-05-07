import { ipcRenderer } from 'electron'
import { LOG } from '../config/events'

export const logger = (str: string) => ipcRenderer.send(LOG, str)
