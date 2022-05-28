// @ts-expect-error -- no types provided for file-icon
import { fileIconToBuffer } from 'file-icon'

export async function getAppIcon(bundleId: string): Promise<string> {
  const buffer = await fileIconToBuffer(bundleId, { size: 64 })
  return `data:image/png;base64,${buffer.toString('base64')}`
}
