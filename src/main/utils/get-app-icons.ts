import { execFile } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import { app } from 'electron'
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

async function getIconFileURL(file: string, size: number): Promise<string> {
  try {
    const { stdout: buffer } = await execFileP(
      binary,
      [JSON.stringify([{ appOrPID: file, size }])],
      { encoding: null, maxBuffer: HUNDRED_MEGABYTES },
    )

    // Save to temp file instead of storing base64 in memory
    const tempDir = app.getPath('temp')
    const iconFileName = `${file.replaceAll(/[^a-zA-Z0-9]/gu, '_')}_${size}.png`
    const iconPath = join(tempDir, 'browserosaurus-icons', iconFileName)
    
    // Ensure directory exists
    await writeFile(iconPath, buffer, { flag: 'w' }).catch(async (error) => {
      if (error.code === 'ENOENT') {
        const { mkdir } = await import('node:fs/promises')
        await mkdir(path.dirname(iconPath), { recursive: true })
        await writeFile(iconPath, buffer, { flag: 'w' })
      } else {
        throw error
      }
    })

    // Return file:// URL instead of base64 - saves massive memory
    return `file://${iconPath}`
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

    // Simple parallel loading - much simpler for small app lists
    const iconPromises = apps.map(async (appData) => {
      try {
        const fileURL = await getIconFileURL(appData.name, 64)
        return { fileURL, name: appData.name }
      } catch (error: unknown) {
        log.warn(`Failed to load icon for ${appData.name}:`, error)
        return null
      }
    })

    const results = await Promise.all(iconPromises)
    
    // Build icons object
    for (const result of results) {
      if (result) {
        icons[result.name] = result.fileURL
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
