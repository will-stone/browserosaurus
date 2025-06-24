import { execFile } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import log from 'electron-log'

import type { AppName } from '../../config/apps.js'
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

// Icon cache in main process - keeps base64 data out of Redux state
const iconCache = new Map<string, string>()

async function getIconBase64(file: string, size: number): Promise<string> {
  const cacheKey = `${file}_${size}`
  
  // Return cached version if available
  if (iconCache.has(cacheKey)) {
    const cachedIcon = iconCache.get(cacheKey)
    if (cachedIcon) {
      return cachedIcon
    }
  }
  
  try {
    const { stdout: buffer } = await execFileP(
      binary,
      [JSON.stringify([{ appOrPID: file, size }])],
      { encoding: null, maxBuffer: HUNDRED_MEGABYTES },
    )

    const base64Icon = `data:image/png;base64,${buffer.toString('base64')}`
    
    // Cache the icon data in main process
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


export async function getAppIcons(apps: Storage['apps']): Promise<void> {
  try {
    const icons: Partial<Record<AppName, string>> = {}

    // Use smaller icons (32px instead of 64px) to reduce memory usage
    const iconPromises = apps.map(async (appData) => {
      try {
        const base64Icon = await getIconBase64(appData.name, 32)
        return { base64Icon, name: appData.name }
      } catch (error: unknown) {
        log.warn(`Failed to load icon for ${appData.name}:`, error)
        return null
      }
    })

    const results = await Promise.all(iconPromises)
    
    // Store smaller base64 icons in Redux
    for (const result of results) {
      if (result) {
        icons[result.name] = result.base64Icon
      }
    }

    // Single dispatch
    dispatch(gotAppIcons(icons))
  } catch (error: unknown) {
    log.error(error)
    // eslint-disable-next-line no-console
    console.error('[getAppIcon error]', error)
  }
}
