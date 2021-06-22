import axios from 'axios'

import { getUpdateUrl } from './get-update-url'

export async function isUpdateAvailable(): Promise<boolean> {
  const { data } = await axios(getUpdateUrl())
  return Boolean(data)
}
