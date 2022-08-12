import log from 'electron-log'
import { execFile } from 'node:child_process'
import path from 'node:path'
import { promisify } from 'node:util'

import type { AppId } from '../../config/apps'
import type { Storage } from '../../shared/state/reducer.storage'
import { gotAppIcons } from '../state/actions'
import { dispatch } from '../state/store'

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

async function getIconDataURI(file: string, size: number): Promise<string> {
  const { stdout: buffer } = await execFileP(
    binary,
    [JSON.stringify([{ appOrPID: file, size }])],
    { encoding: null, maxBuffer: HUNDRED_MEGABYTES },
  )

  return `data:image/png;base64,${buffer.toString('base64')}`
}

export async function getAppIcons(apps: Storage['apps']): Promise<void> {
  try {
    const icons: Partial<Record<AppId, string>> = {}

    for await (const app of apps) {
      try {
        const dataURI = await getIconDataURI(app.id, 64)
        icons[app.id] = dataURI
      } catch (error: unknown) {
        log.warn(error)
      }
    }

    dispatch(gotAppIcons(icons))
  } catch (error: unknown) {
    log.error(error)
    // eslint-disable-next-line no-console
    console.error('[getAppIcon error]', error)
  }
}
