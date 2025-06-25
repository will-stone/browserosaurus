import { execFile } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import { ipcMain } from 'electron'
import log from 'electron-log'

import type { AppName } from '../../config/apps.js'
import { Channel } from '../../shared/state/channels.js'
import type { Storage } from '../../shared/state/reducer.storage.js'
import { gotAppIcons } from '../state/actions.js'
import { dispatch } from '../state/store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const execFileP = promisify(execFile)

const binary = path.join(
  __dirname,
  '..',
  '..',
  'node_modules',
  'file-icon',
  'file-icon',
)

const HUNDRED_MEGABYTES = 1024 * 1024 * 100
const iconCache = new Map<string, string>()

async function getIconBase64(file: string, size: number): Promise<string> {
  const cacheKey = `${file}_${size}`
  
  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey) || ''
  }
  
  try {
    const { stdout: buffer } = await execFileP(
      binary,
      [JSON.stringify([{ appOrPID: file, size }])],
      { encoding: null, maxBuffer: HUNDRED_MEGABYTES },
    )

    const base64Icon = `data:image/png;base64,${buffer.toString('base64')}`
    iconCache.set(cacheKey, base64Icon)
    
    return base64Icon
  } catch (error: unknown) {
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.log(`Error reading ${file}`)
    }
    throw error
  }
}

ipcMain.handle(Channel.GET_ICON, async (event, appName: string) => {
  try {
    return await getIconBase64(appName, 64)
  } catch (error) {
    log.warn(`Failed to get icon for ${appName}:`, error)
    return ''
  }
})


export async function getAppIcons(apps: Storage['apps']): Promise<void> {
  try {
    const icons: Partial<Record<AppName, string>> = {}

    const iconPromises = apps.map(async (appData) => {
      try {
        await getIconBase64(appData.name, 64)
        return { name: appData.name }
      } catch (error: unknown) {
        log.warn(`Failed to load icon for ${appData.name}:`, error)
        return null
      }
    })

    const results = await Promise.all(iconPromises)
    
    for (const result of results) {
      if (result) {
        icons[result.name] = 'cached'
      }
    }

    dispatch(gotAppIcons(icons))
  } catch (error: unknown) {
    log.error(error)
    // eslint-disable-next-line no-console
    console.error('[getAppIcon error]', error)
  }
}
