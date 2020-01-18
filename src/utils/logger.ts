import { ipcRenderer } from 'electron'

import { LOG } from '../config/events'

const logger = (str: string) => ipcRenderer.send(LOG, str)

export default logger
