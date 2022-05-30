// @ts-expect-error -- no types provided for file-icon
import { fileIconToBuffer } from 'file-icon'

import type { AppId } from '../../config/apps'
import type { Storage } from '../../shared/state/reducer.storage'
import { gotAppIcons } from '../state/actions'
import { dispatch } from '../state/store'

async function getAppIcon(bundleId: string): Promise<string> {
  try {
    const buffer = await fileIconToBuffer(bundleId, { size: 64 })
    return `data:image/png;base64,${buffer.toString('base64')}`
  } catch {
    return ''
  }
}

export async function getAppIcons(apps: Storage['apps']): Promise<void> {
  const icons: Partial<Record<AppId, string>> = {}

  for await (const app of apps) {
    const icon = await getAppIcon(app.id)
    icons[app.id] = icon
  }

  dispatch(gotAppIcons(icons))
}
